import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Input, Switch, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import { getEditRecord } from '@/utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.event.type.model.type';
/**
 * 对象类型展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ eventType, loading }) => ({
  eventType,
  loading: {
    save: loading.effects['eventType/saveObjectType'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class ObjectTypeDrawer extends PureComponent {
  // state = {
  //   // objectTypeId: undefined,
  // };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      initData,
      eventType: { objectTypeList = [], objectTypePagination = {} },
    } = this.props;
    const { eventTypeId } = initData;
    if (
      objectTypeList.length === 0 ||
      (objectTypeList.length > 0 && objectTypeList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'eventType/updateState',
        payload: {
          objectTypeList: [
            {
              eventTypeId,
              objectTypeId: '',
              objectTypeCode: '',
              relId: '',
              _status: 'create',
            },
            ...objectTypeList,
          ],
          objectTypePagination: addItemToPagination(objectTypeList.length, objectTypePagination),
        },
      });
    }
  }

  /**
   * 编辑对象类型
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      eventType: { objectTypeList },
    } = this.props;
    const newList = objectTypeList.map(item => {
      if (record.relId === item.relId) {
        return { ...item, _status: flag ? 'update' : '', originObjectTypeCode: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'eventType/updateState',
      payload: { objectTypeList: newList },
    });
    // dispatch({
    //   type: 'eventType/updateState',
    //   payload: {
    //     objectTypeList: changeTableRowEditState(record, objectTypeList, 'relId'),
    //   },
    // });
  }

  // 取消编辑对象类型
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      eventType: { objectTypeList, objectTypePagination },
    } = this.props;
    const newList = objectTypeList.filter(item => item.relId !== record.relId);
    dispatch({
      type: 'eventType/updateState',
      payload: {
        objectTypeList: newList,
        objectTypePagination: delItemToPagination(objectTypeList.length, objectTypePagination),
      },
    });
  }

  // 保存对象类型
  @Bind()
  handleSave(record, index) {
    const {
      dispatch,
      initData,
      eventType: { objectTypeList = [] },
    } = this.props;
    const { eventTypeId } = initData;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields((err, value) => {
      if (!err) {
        const params = getEditRecord(record, objectTypeList, 'relId', needChangeFlags);
        dispatch({
          type: 'eventType/saveObjectType',
          payload: {
            ...params,
            eventTypeId,
            relId: record.relId,
            objectTypeId: value.objectTypeId,
          },
        }).then(res => {
          if (res && res.success) {
            objectTypeList[index] = res.rows;
            // objectTypeList[index]._status = undefined;
            // objectTypeList[index].relId = res.rows.relId;
            // objectTypeList[index].objectTypeId = res.rows.objectTypeId;
            // objectTypeList[index].objectTypeCode =
            //   objectTypeList[index].originObjectTypeCode || objectTypeList[index].objectTypeCode;
            dispatch({
              type: 'eventType/updateState',
              payload: {
                objectTypeList,
                // objectTypeList: updateTableRowData(res.rows, objectTypeList, 'relId'),
              },
            });
            notification.success();
            // this.setState({
            //   objectTypeId: undefined,
            // });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  // lov选中事件
  @Bind
  handleObjectTypeChange(val, record, index) {
    const {
      eventType: { objectTypeList = [] },
      dispatch,
    } = this.props;
    objectTypeList[index].originObjectTypeCode = record.objectTypeCode;
    objectTypeList[index].description = record.description;
    dispatch({
      type: 'eventType/updateState',
    });
    // this.setState({
    //   objectTypeId: record.objectTypeId,
    // });
    // col.$form.setFieldsValue({
    //   description: record.description,
    // });
  }

  @Bind
  handleCancel() {
    const { onCancel, dispatch } = this.props;
    dispatch({
      type: 'eventType/updateState',
      payload: {
        objectTypeList: [],
      },
    });
    onCancel();
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    const { dispatch, initData } = this.props;
    dispatch({
      type: 'eventType/fetchObjectTypeList',
      payload: {
        eventTypeId: initData.eventTypeId,
        page: pagination,
      },
    });
  }

  render() {
    const {
      visible,
      loading,
      initData,
      eventType: { objectTypeList = [], objectTypePagination = {} },
    } = this.props;
    const { eventTypeId } = initData;
    const { save } = loading;
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码'),
        dataIndex: 'objectTypeCode',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`objectTypeId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码'),
                    }),
                  },
                ],
                initialValue: record.objectTypeId,
              })(
                <Lov
                  code="MT.OBJECT_TYPE"
                  textValue={val}
                  queryParams={{ tenantId, eventId: eventTypeId }}
                  onChange={(value, records) => this.handleObjectTypeChange(value, records, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('对象类型描述'),
        dataIndex: 'description',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.description`).d('对象类型描述'),
                    }),
                  },
                ],
                initialValue: record.description,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag !== 'N',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record, false, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.type.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEdit(record, true, index)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}
            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.event.type.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.event.type.title.object').d('对象类型维护')}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <EditTable
          bordered
          lodaing={save}
          rowKey="relId"
          columns={columns}
          dataSource={objectTypeList}
          pagination={objectTypePagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}
