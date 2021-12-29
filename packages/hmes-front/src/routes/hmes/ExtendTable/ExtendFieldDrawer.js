/*
 *
 * date: 2020-04-16
 * author : 黄文钊 <wenzhao.huang@hand-china.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */

import React from 'react';
import { Modal, Button, Popconfirm, Input, Form } from 'hzero-ui';
import { connect } from 'dva';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';

import formatterCollections from 'utils/intl/formatterCollections';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import notification from 'utils/notification';
import uuid from 'uuid/v4';

// 拖拽引入
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
//

import styles from './index.less';

const modelPrompt = 'tarzan.hmes.extendField.model.extendField';
const FormItem = Form.Item;
// 拖拽
function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}
@Form.create({ fieldNameProp: null })
class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    restProps.record.$form = this.props.form;
    const style = { ...restProps.style, cursor: 'move' };
    // eslint-disable-next-line
    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }
    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />)
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (selfConnect, monitor) => ({
  connectDropTarget: selfConnect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (selfConnect, monitor) => ({
    connectDragSource: selfConnect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);
//
@DragDropContext(HTML5Backend)
@connect(({ extendTable, loading }) => ({
  extendTable,
  fetchLoading: loading.effects['extendTable/fetchExtendFieldList'],
  submitLoading: loading.effects['extendTable/saveExtendFieldList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.extendTable',
})
@Form.create({ fieldNameProp: null })
export default class ExtendFieldDrawer extends React.PureComponent {
  state = { canEdit: false, attrName: '', attrMeaning: '', lineIndex: null };

  componentDidMount() {
    const { tableId, dispatch } = this.props;
    dispatch({
      type: 'extendTable/fetchExtendFieldList',
      payload: {
        extendTableDescId: tableId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'extendTable/updateState',
      payload: {
        fieldDrawerList: [],
      },
    });
  }

  // 拖拽操作
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { dispatch, fieldDrawerList } = this.props;
    const dragRow = fieldDrawerList[dragIndex];
    const list = update(this.props.extendTable, {
      fieldDrawerList: {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      },
    }).fieldDrawerList;
    dispatch({
      type: 'extendTable/changeOvge',
      payload: {
        fieldDrawerList: list,
      },
    }).then(res => {
      if (res) {
        if (res.success) {
          dispatch({
            type: 'extendTable/updateState',
            payload: {
              fieldDrawerList: list.map((item, index) => {
                return {
                  ...item,
                  sequence: index,
                };
              }),
            },
          });
        } else {
          notification.error({ message: res.message });
        }
      }
    });
  };

  handleCreate = () => {
    const { dispatch, fieldDrawerList } = this.props;
    this.setState({ attrMeaning: '', attrName: '', lineIndex: null });
    dispatch({
      type: 'extendTable/updateState',
      payload: {
        fieldDrawerList: [
          {
            _status: 'create',
            enableFlag: 'Y',
            uuid: uuid(),
          },
          ...fieldDrawerList,
        ],
      },
    });
  };

  // 编辑
  handleEdit = () => {
    this.setState({ canEdit: true });
  };

  // 行删除
  deleteData = record => {
    const { dispatch, tableId, fieldDrawerList } = this.props;
    if (record._status === 'create') {
      const list = fieldDrawerList.filter(item => item.uuid !== record.uuid);
      dispatch({
        type: 'extendTable/updateState',
        payload: {
          fieldDrawerList: list,
        },
      });
    } else {
      dispatch({
        type: 'extendTable/saveExtendFieldList',
        payload: {
          fieldDrawerList: [{ ...record, enableFlag: 'N' }],
        },
      }).then(res => {
        if (res && res.success) {
          dispatch({
            type: 'extendTable/fetchExtendFieldList',
            payload: {
              extendTableDescId: tableId,
            },
          });
        } else {
          notification.error({ message: res.message });
        }
      });
    }
  };

  // 保存
  handleSave = () => {
    const { dispatch, fieldDrawerList, tableId } = this.props;
    // eslint-disable-next-line no-unused-vars
    let len = 0;
    for (let i = 0; i < fieldDrawerList.length; i++) {
      // eslint-disable-next-line no-loop-func
      fieldDrawerList[i].$form.validateFieldsAndScroll(childError => {
        if (!childError) {
          len++;
        }
      });
    }
    dispatch({
      type: 'extendTable/saveExtendFieldList',
      payload: {
        fieldDrawerList: fieldDrawerList.map((item, index) => ({
          ...item,
          attrName: item.$form.getFieldValue('attrName')
            ? item.$form.getFieldValue('attrName')
            : item.attrName,
          attrMeaning: item.$form.getFieldValue('attrMeaning'),
          extendTableDescId: tableId,
          sequence: item.sequence ? item.sequence : index,
        })),
      },
    }).then(res => {
      if (res && res.success) {
        dispatch({
          type: 'extendTable/fetchExtendFieldList',
          payload: {
            extendTableDescId: tableId,
          },
        });
        this.setState({ canEdit: false });
      }
    });
  };

  changeName = (index, val) => {
    this.setState({ attrName: val.target.value, lineIndex: index });
  };

  changeField = (index, val) => {
    this.setState({ attrMeaning: val.target.value, lineIndex: index });
  };

  render() {
    const { canEdit, attrName, attrMeaning, lineIndex } = this.state;
    const { visible, onCancel, fieldDrawerList } = this.props;
    const columns = [
      {
        title: (
          <Button
            style={
              canEdit
                ? { backgroundColor: '#548FFC', color: '#fff' }
                : { backgroundColor: '#f5f5f5', color: 'rgba(0, 0, 0, 0.25)' }
            }
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (_, record) =>
          ['create'].includes(record._status) ? (
            <Button
              disabled={!canEdit}
              icon="minus"
              shape="circle"
              size="small"
              onClick={() => this.deleteData(record)}
            />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={() => this.deleteData(record)}
            >
              <Button disabled={!canEdit} icon="minus" shape="circle" size="small" />
            </Popconfirm>
          ),
      },
      {
        title: intl.get(`${modelPrompt}.attrName`).d('属性名'),
        dataIndex: 'attrName',
        width: 180,
        render: (val, record) =>
          canEdit && ['create'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`attrName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrName`).d('属性名'),
                    }),
                  },
                ],
                initialValue:
                  lineIndex === record.uuidv ? attrName || record.attrName : record.attrName,
              })(<Input onChange={this.changeName.bind(this, record.uuid)} />)}
            </FormItem>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.attrMeaning`).d('属性描述'),
        dataIndex: 'attrMeaning',
        render: (val, record) =>
          canEdit && ['create', 'update'].includes(record._status) ? (
            <FormItem>
              {record.$form.getFieldDecorator(`attrMeaning`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.attrMeaning`).d('属性描述'),
                    }),
                  },
                ],
                initialValue:
                  lineIndex === record.uuid
                    ? attrMeaning || record.attrMeaning
                    : record.attrMeaning,
              })(
                <TLEditor
                  field="attrMeaning"
                  onChange={this.changeField.bind(this, record.uuid)}
                  dto="io.tarzan.common.domain.entity.MtExtendSettings"
                  pkvalue={{ extendId: record.extendId || null }}
                />
              )}
            </FormItem>
          ) : (
            val
          ),
      },
    ];
    const drawerTitle = (
      <div className={styles.customTitle}>
        <div>{intl.get('tarzan.hmes.extendField.title.edit').d('编辑扩展字段')}</div>
        <div className={styles.buttonGroup}>
          {canEdit ? (
            <Button
              onClick={this.handleSave}
              type="primary"
              icon="save"
              loading={this.props.submitLoading}
            >
              {intl.get('tarzan.hmes.type.button.save').d('保存')}
            </Button>
          ) : (
            <Button onClick={this.handleEdit} type="primary" icon="edit">
              {intl.get('tarzan.hmes.type.button.edit').d('编辑')}
            </Button>
          )}
        </div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        width={720}
        title={drawerTitle}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={
          <Button onClick={onCancel}>{intl.get('hzero.common.button.back').d('返回')}</Button>
        }
      >
        <EditTable
          ref={ref => {
            this.editTable = ref;
          }}
          loading={this.props.fetchLoading}
          rowKey={record => record.uuid}
          components={this.components}
          onRow={(_, index) => ({
            index,
            moveRow: this.moveRow,
          })}
          dataSource={fieldDrawerList}
          columns={columns}
          pagination={false}
          bordered
        />
      </Modal>
    );
  }
}
