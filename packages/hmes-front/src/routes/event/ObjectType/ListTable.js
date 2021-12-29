/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Badge, Input, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import { delItemToPagination } from 'utils/utils';
import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import ObjectSQLDrawer from './ObjectSQLDrawer';
import TableDrawer from './TableDrawer';
import ObjectTypeDrawer from './ObjectTypeDrawer';

const modelPrompt = 'tarzan.event.objectType.model.objectType';

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} eventTypeList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ objectType, loading }) => ({
  objectType,
  fetchLoading: loading.effects['objectType/fetchObjectTypeList'],
}))
@formatterCollections({
  code: ['tarzan.event.objectType'], // code 为 [服务].[功能]的字符串数组
})
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);

    this.state = {
      objectSQLDrawerVisible: false, // 用于对象查询语句
      initObjectSQLData: {},
      tableDrawerVisible: false, // 用于对象展示列
      initTableData: {},
      objectTypeDrawerVisible: false, // 用于对象展示预览
      initObjectTypeData: {},
    };
  }

  /**
   * 编辑事件请求类型
   */
  @Bind()
  handleEditObjectType(record) {
    const {
      dispatch,
      objectType: { objectTypeList },
    } = this.props;
    dispatch({
      type: 'objectType/updateState',
      payload: {
        objectTypeList: changeTableRowEditState(record, objectTypeList, 'objectTypeId'),
      },
    });
  }

  // 取消新增行
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      objectType: { objectTypeList, objectTypePagination },
    } = this.props;
    const newList = objectTypeList.filter(item => item.objectTypeId !== record.objectTypeId);
    dispatch({
      type: 'objectType/updateState',
      payload: {
        objectTypeList: newList,
        objectTypePagination: delItemToPagination(objectTypeList.length, objectTypePagination),
      },
    });
  }

  // 保存事件请求类型
  @Bind
  handleSaveEventRequestType(record) {
    const {
      dispatch,
      objectType: { objectTypeList },
    } = this.props;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, objectTypeList, 'objectTypeId', needChangeFlags);
        dispatch({
          type: 'objectType/saveObjectType',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            dispatch({
              type: 'objectType/updateState',
              payload: {
                objectTypeList: updateTableRowData(res.rows, objectTypeList, 'objectTypeId'),
              },
            });
            notification.success();
          } else {
            notification.error({ message: res.message });
          }
        });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'objectType/fetchObjectTypeList',
      payload: {
        page: objectTypePagination,
      },
    });
  }

  // 打开查询语句抽屉
  @Bind
  handleObjectSQLDrawerShow(record = {}) {
    this.setState({ objectSQLDrawerVisible: true, initObjectSQLData: record });
  }

  // 关闭查询语句抽屉
  @Bind
  handleObjectSQLDrawerCancel() {
    this.setState({ objectSQLDrawerVisible: false, initObjectSQLData: {} });
  }

  // 查询语句抽屉确认
  @Bind
  handleObjectSQLDrawerOk(fieldsValue) {
    const {
      dispatch,
      objectType: { objectTypeList },
    } = this.props;
    const params = this.state.initObjectSQLData;
    Object.keys(fieldsValue).forEach(key => {
      params[key] = fieldsValue[key];
    });
    dispatch({
      type: 'objectType/saveObjectType',
      payload: {
        ...params,
      },
    }).then(res => {
      if (res && res.success) {
        const newList = objectTypeList.map(item => {
          if (res.rows.objectTypeId === item.objectTypeId) {
            const newItem = item;
            Object.keys(res.rows).forEach(key => {
              newItem[key] = res.rows[key];
            });
            return { ...newItem };
          } else {
            return item;
          }
        });
        dispatch({
          type: 'objectType/updateState',
          payload: { objectTypeList: newList },
        });
      }
    });
    this.setState({
      objectSQLDrawerVisible: false,
      initObjectSQLData: {},
    });
  }

  // 打开展示列抽屉
  @Bind
  handleTableDrawerShow(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'objectType/fetchTableList',
      payload: {
        objectTypeId: record.objectTypeId,
      },
    });
    this.setState({ tableDrawerVisible: true, initTableData: record });
  }

  // 关闭展示列抽屉
  @Bind
  handleTableDrawerCancel() {
    this.setState({ tableDrawerVisible: false, initTableData: {} });
  }

  // 打开展示预览抽屉
  @Bind
  handleObjectTypeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'objectType/queryObjectTypeSQL',
      payload: {
        objectTypeId: record.objectTypeId,
      },
    }).then(res => {
      const newRecord = record;
      newRecord.eventTypeQuerySql = res.rows.eventTypeQuerySql;
      this.setState({ objectTypeDrawerVisible: true, initObjectTypeData: record });
    });
  }

  // 关闭展示预览抽屉
  @Bind
  handleObjectTypeDrawerCancel() {
    this.setState({ objectTypeDrawerVisible: false, initObjectTypeData: {} });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
    this.props.dispatch({
      type: 'objectType/updateState',
      payload: { selectedRowKeys },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      objectType: { objectTypeList = [], objectTypePagination = {} },
      fetchLoading,
    } = this.props;
    const {
      selectedRowKeys,
      objectSQLDrawerVisible,
      tableDrawerVisible,
      initObjectSQLData,
      initTableData,
      objectTypeDrawerVisible,
      initObjectTypeData,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码'),
        dataIndex: 'objectTypeCode',
        width: 220,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`objectTypeCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.objectTypeCode`).d('对象类型编码'),
                    }),
                  },
                ],
                initialValue: record.objectTypeCode,
              })(<Input typeCase="upper" inputChinese={false} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('对象类型描述'),
        dataIndex: 'description',
        width: 220,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: record.description,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('对象类型描述')}
                  field="description"
                  dto="tarzan.general.domain.entity.MtEventObjectType"
                  pkValue={{ objectTypeId: record.objectTypeId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 220,
        align: 'center',
        render: (_, record) =>
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
        title: intl.get(`${modelPrompt}.objectQuerySQL`).d('对象查询语句'),
        dataIndex: 'objectQuerySQL',
        width: 180,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleObjectSQLDrawerShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.querySQL`).d('查询语句')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectExhibitionCol`).d('对象展示列'),
        dataIndex: 'objectExhibitionCol',
        width: 180,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleTableDrawerShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.exhibitionCol`).d('展示列')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectPreview`).d('对象展示预览'),
        dataIndex: 'objectPreview',
        width: 180,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            <a onClick={() => this.handleObjectTypeDrawerShow(record)}>
              {intl.get(`${modelPrompt}.preview`).d('对象类型')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 180,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditObjectType(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEventRequestType(record)}>
                  {intl.get('tarzan.event.objectType.button.save').d('保存')}
                </a>
              </Fragment>
            )}

            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEditObjectType(record)}>
                {intl.get('tarzan.event.objectType.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEventRequestType(record)}>
                  {intl.get('tarzan.event.objectType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    // 抽屉参数
    const objectSQLDrawerProps = {
      visible: objectSQLDrawerVisible,
      onCancel: this.handleObjectSQLDrawerCancel,
      onOk: this.handleObjectSQLDrawerOk,
      initData: initObjectSQLData,
    };

    // 抽屉参数
    const tableDrawerProps = {
      visible: tableDrawerVisible,
      onCancel: this.handleTableDrawerCancel,
      onOk: this.handleTableDrawerCancel,
      initData: initTableData,
    };

    // 抽屉参数
    const objectTypeDrawer = {
      visible: objectTypeDrawerVisible,
      onCancel: this.handleObjectTypeDrawerCancel,
      onOk: this.handleObjectTypeDrawerCancel,
      initData: initObjectTypeData,
    };
    return (
      <>
        <EditTable
          loading={fetchLoading}
          rowSelection={rowSelection}
          rowKey="objectTypeId"
          dataSource={objectTypeList}
          columns={columns}
          pagination={objectTypePagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <ObjectSQLDrawer {...objectSQLDrawerProps} />
        <TableDrawer {...tableDrawerProps} />
        <ObjectTypeDrawer {...objectTypeDrawer} />
      </>
    );
  }
}
