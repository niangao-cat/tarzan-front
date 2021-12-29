/**
 * transformation - 消息维护
 * @date: 2019-7-29
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Popconfirm } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
// import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import {
  addItemToPagination,
  getCurrentOrganizationId,
  delItemToPagination,
  // delItemsToPagination,
} from 'utils/utils';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.acquisition.transformation.model.transformation';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} transformation - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ transformation, loading }) => ({
  transformation,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['transformation/fetchAPIList'],
  deleteLoading: loading.effects['transformation/deleteAPI'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.acquisition.transformation',
})
export default class ErrorMessage extends React.Component {
  state = {
    selectedRows: [],
    pagination: {},
    search: {},
  };

  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'transformation/fetchAPIList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
        pagination: {},
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      selectedRows: [],
      pagination: {},
      search: {},
    });
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    this.setState(
      {
        pagination,
      },
      () => {
        this.refresh();
      }
    );
    // const {
    //   transformation: { messagePagination = {} },
    // } = this.props;
    // this.fetchQueryList(messagePagination);
  }

  /**
   * 新建消息
   */
  @Bind()
  handleCreateMessage() {
    const {
      dispatch,
      transformation: { messageList = [], messagePagination = {} },
    } = this.props;
    if (
      messageList.length === 0 ||
      (messageList.length > 0 && messageList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'transformation/updateState',
        payload: {
          messageList: [
            {
              apiId: null,
              apiClass: '',
              _status: 'create',
            },
            ...messageList,
          ],
          messagePagination: addItemToPagination(messageList.length, messagePagination),
        },
      });
    }
  }

  /**
   * 编辑消息
   */
  @Bind()
  handleEditMessage(record, flag) {
    const {
      dispatch,
      transformation: { messageList },
    } = this.props;
    const newList = messageList.map(item => {
      if (record.apiId === item.apiId) {
        return { ...item, _status: flag ? 'update' : '', changeModuleDesc: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'transformation/updateState',
      payload: { messageList: newList },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      transformation: { messageList, messagePagination = {} },
    } = this.props;
    const newList = messageList.filter(item => item.apiId !== record.apiId);
    dispatch({
      type: 'transformation/updateState',
      payload: {
        messageList: newList,
        messagePagination: delItemToPagination(10, messagePagination),
      },
    });
  }

  /**
   * 取消行
   */
  @Bind()
  handleCancel(record) {
    const {
      dispatch,
      transformation: { messageList },
    } = this.props;
    const newList = messageList.filter(item => item.apiId !== record.apiId);
    dispatch({
      type: 'transformation/updateState',
      payload: {
        messageList: newList,
      },
    });
  }

  // 保存消息
  @Bind
  handleSaveMessage(record, index) {
    const {
      dispatch,
      transformation: { messageList = [] },
    } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'transformation/saveAPI',
          payload: {
            ...fieldsValue,
            apiId: record.apiId,
          },
        }).then(res => {
          if (res && res.success) {
            // this.refresh();
            messageList[index].apiId = res.rows.apiId;
            messageList[index]._status = '';
            messageList[index].apiClass = fieldsValue.apiClass;
            messageList[index].apiName = fieldsValue.apiName;
            messageList[index].apiFunction = fieldsValue.apiFunction;
            dispatch({
              type: 'transformation/updateState',
              payload: {
                messageList,
                // messagePagination: addItemToPagination(10, messagePagination),
              },
            });
          } else {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  // 删除
  @Bind
  deleteAPI() {
    const {
      transformation: { messageList = [] },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    // apiId
    dispatch({
      type: 'transformation/deleteAPI',
      // payload: selectedRows,
      payload: messageList
        .filter(ele => selectedRows.some(eles => eles === ele.apiId))
        .map(ele => ele.apiId),
    }).then(res => {
      if (res && res.success) {
        // this.refresh();
        // const len = messageList.length;
        // dispatch({
        //   type: 'transformation/updateState',
        //   payload: {
        //     messageList: messageList.filter(
        //       ele => !selectedRows.some(eles => eles === ele.apiId)
        //     ),
        //     messagePagination: delItemsToPagination(selectedRows.length, len, messagePagination),
        //   },
        // });
        this.setState(
          {
            selectedRows: [],
            pagination: {},
          },
          () => {
            this.refresh();
          }
        );
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  @Bind
  updateState = (value, record, index) => {
    const {
      dispatch,
      transformation: { messageList = [] },
    } = this.props;
    messageList[index].changeModuleDesc = record.description;
    dispatch({
      type: 'transformation/updateState',
      payload: {
        messageList,
      },
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      transformation: { messageList = [], messagePagination = {} },
      fetchMessageLoading,
      deleteLoading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.apiClass`).d('API类名'),
        width: 200,
        dataIndex: 'apiClass',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`apiClass`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.apiClass`).d('API类名'),
                    }),
                  },
                ],
                initialValue: val,
              })(<Input inputChinese={false} trim typeCase="upper" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.apiName`).d('API描述'),
        dataIndex: 'apiName',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`apiName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.apiName`).d('API描述'),
                    }),
                  },
                ],
                initialValue: record.apiName,
              })(
                <Input />
                // <TLEditor
                //   label={intl.get(`${modelPrompt}.apiName`).d('API描述')}
                //   field="apiName"
                //   dto="io.tarzan.common.domain.entity.MtErrorMessage"
                //   pkValue={{ apiId: record.apiId }}
                // />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.apiFunction`).d('API函数'),
        dataIndex: 'apiFunction',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`apiFunction`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.apiFunction`).d('API函数'),
                    }),
                  },
                ],
                initialValue: record.apiFunction,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditMessage(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveMessage(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditMessage(record, true)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveMessage(record, index)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
      getCheckboxProps: record => ({
        disabled: !record.apiId,
      }),
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.acquisition.transformation.title.list').d('API转化')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateMessage}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button
              icon="delete"
              loading={deleteLoading}
              disabled={selectedRows.length === 0}
              // onClick={this.deleteType}
            >
              {intl.get('tarzan.acquisition.transformation.button.delete').d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteAPI}
            >
              <Button
                icon="delete"
                disabled={selectedRows.length === 0}
                loading={deleteLoading}
                // onClick={this.deleteAPI}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <EditTable
            loading={fetchMessageLoading}
            rowKey="apiId"
            rowSelection={rowSelection}
            dataSource={messageList}
            columns={columns}
            pagination={messagePagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
