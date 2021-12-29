/**
 * ObjectTypeDrawer 表格抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Form,
  Button,
  Spin,
  Badge,
  Input,
  Switch,
  Select,
  Popconfirm,
  InputNumber,
} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import { addItemToPagination } from 'utils/utils';
import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.event.objectType.model.objectType';

/**
 * 关联表展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ objectType, loading }) => ({
  objectType,
  loading: {
    query: loading.effects['objectType/fetchTableList'],
  },
}))
@formatterCollections({
  code: ['tarzan.event.objectType'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class TableDrawer extends PureComponent {
  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      objectType: { tableList = [], tablePagination = {} },
      initData,
    } = this.props;
    if (tableList.length === 0 || (tableList.length > 0 && tableList[0]._status !== 'create')) {
      dispatch({
        type: 'objectType/updateState',
        payload: {
          tableList: [
            {
              objectTypeId: initData.objectTypeId,
              objectColumnId: '',
              relationTable: '',
              _status: 'create',
            },
            ...tableList,
          ],
          tablePagination: addItemToPagination(tableList.length, tablePagination),
        },
      });
    }
  }

  /**
   * 删除行
   */
  @Bind()
  handleDelete(record) {
    this.props
      .dispatch({
        type: 'objectType/deleteObjectColumn',
        payload: {
          list: [record.objectColumnId],
          objectTypeId: this.props.initData.objectTypeId,
        },
      })
      .then(res => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const {
      objectType: { objectTypePagination = {} },
    } = this.props;
    const pager = { ...objectTypePagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.fetchQueryList(pager);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(objectTypePagination) {
    const { dispatch, initData } = this.props;
    dispatch({
      type: 'objectType/fetchTableList',
      payload: {
        objectTypeId: initData.objectTypeId,
        page: objectTypePagination,
      },
    });
  }

  /**
   * 编辑关联表
   */
  @Bind()
  handleEdit(record) {
    const {
      dispatch,
      objectType: { tableList },
    } = this.props;
    dispatch({
      type: 'objectType/updateState',
      payload: { tableList: changeTableRowEditState(record, tableList, 'objectColumnId') },
    });
  }

  // 取消编辑关联表
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      objectType: { tableList = [] },
    } = this.props;
    const newList = tableList.filter(item => item.objectColumnId !== record.objectColumnId);
    dispatch({
      type: 'objectType/updateState',
      payload: { tableList: newList },
    });
  }

  // 保存关联表
  @Bind()
  handleSave(record) {
    const {
      dispatch,
      objectType: { tableList = [] },
    } = this.props;
    const needChangeFlags = ['displayFlag', 'enableFlag', 'eventFlag'];
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, tableList, 'objectColumnId', needChangeFlags);
        dispatch({
          type: 'objectType/saveTable',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            dispatch({
              type: 'objectType/updateState',
              payload: { tableList: updateTableRowData(res.rows, tableList, 'objectColumnId') },
            });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  render() {
    const {
      visible,
      onCancel,
      objectType: { tableList = [], tablePagination = {}, columnTypeList = [] },
    } = this.props;
    const filters = [];
    columnTypeList.forEach(element => {
      filters.push({
        text: element.description,
        value: element.typeCode,
      });
    });
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
        render: (_, record) => (
          <Popconfirm
            title={intl.get(`${modelPrompt}.confirmDeletion`).d('确认删除？')}
            okText={intl.get(`${modelPrompt}.sure`).d('确定')}
            cancelText={intl.get(`${modelPrompt}.cancel`).d('取消')}
            onConfirm={() => this.handleDelete(record)}
          >
            <Button icon="minus" shape="circle" size="small" />
          </Popconfirm>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('展示顺序'),
        dataIndex: 'lineNumber',
        width: 110,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`lineNumber`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.lineNumber`).d('展示顺序'),
                    }),
                  },
                ],
                initialValue: record.lineNumber,
              })(<InputNumber style={{ width: '100%' }} inputChinese={false} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.columnField`).d('展示列字段'),
        dataIndex: 'columnField',
        width: 180,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`columnField`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.columnField`).d('展示列字段'),
                    }),
                  },
                ],
                initialValue: record.columnField,
              })(<Input inputChinese={false} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.columnType`).d('展示列类型'),
        dataIndex: 'columnType',
        width: 120,
        align: 'center',
        filters,
        onFilter: (value, record) => record.columnType.indexOf(value) === 0,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`columnType`, {
                initialValue: record.columnType ? record.columnType : columnTypeList[0].typeCode,
              })(
                <Select>
                  {columnTypeList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            columnTypeList.filter(item => item.typeCode === val)[0].description
          ),
      },
      {
        title: intl.get(`${modelPrompt}.columnTitle`).d('展示标题'),
        dataIndex: 'columnTitle',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`columnTitle`, {
                initialValue: record.columnTitle,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.columnTitle`).d('展示标题')}
                  field="columnTitle"
                  dto="tarzan.general.domain.entity.MtEventObjectColumn"
                  pkValue={{ objectColumnId: record.objectColumnId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.eventFlag`).d('事件主键标识'),
        dataIndex: 'eventFlag',
        width: 110,
        align: 'center',
        render: (_, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`eventFlag`, {
                initialValue: record.eventFlag === 'Y',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.eventFlag === 'Y' ? 'success' : 'error'}
              text={
                record.eventFlag === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get(`${modelPrompt}.displayFlag`).d('是否展示'),
        dataIndex: 'displayFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`displayFlag`, {
                initialValue: record.displayFlag === 'Y',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.displayFlag === 'Y' ? 'success' : 'error'}
              text={
                record.displayFlag === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag === 'Y',
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
        width: 140,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEdit(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record)}>
                  {intl.get('tarzan.event.objectType.button.save').d('保存')}
                </a>
              </Fragment>
            )}

            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEdit(record)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record)}>
                  {intl.get('tarzan.event.objectType.button.save').d('保存')}
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
        width={1080}
        title={intl.get('tarzan.event.objectType.title.exhibitionCol').d('展示列维护')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <div style={{ width: '100%' }}>
            <EditTable
              bordered
              rowKey="objectColumnId"
              columns={columns}
              dataSource={tableList}
              pagination={tablePagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
