/**
 * errorMessage - 消息维护
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
import Lov from 'components/Lov';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import {
  addItemToPagination,
  getCurrentOrganizationId,
  delItemToPagination,
  // delItemsToPagination,
} from 'utils/utils';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.hmes.message.model.message';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ errorMessage, loading }) => ({
  errorMessage,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['errorMessage/fetchMessageList'],
  deleteLoading: loading.effects['errorMessage/deleteMessage'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.hmes.message',
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
      type: 'errorMessage/fetchMessageList',
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
    //   errorMessage: { messagePagination = {} },
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
      errorMessage: { messageList = [], messagePagination = {} },
    } = this.props;
    if (
      messageList.length === 0 ||
      (messageList.length > 0 && messageList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'errorMessage/updateState',
        payload: {
          messageList: [
            {
              messageId: null,
              messageCode: '',
              message: '',
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
      errorMessage: { messageList },
    } = this.props;
    const newList = messageList.map(item => {
      if (record.messageId === item.messageId) {
        return { ...item, _status: flag ? 'update' : '', changeModuleDesc: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'errorMessage/updateState',
      payload: { messageList: newList },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      errorMessage: { messageList, messagePagination = {} },
    } = this.props;
    const newList = messageList.filter(item => item.messageId !== record.messageId);
    dispatch({
      type: 'errorMessage/updateState',
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
      errorMessage: { messageList },
    } = this.props;
    const newList = messageList.filter(item => item.messageId !== record.messageId);
    dispatch({
      type: 'errorMessage/updateState',
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
      errorMessage: { messageList = [] },
    } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'errorMessage/saveMessage',
          payload: {
            ...fieldsValue,
            messageId: record.messageId,
          },
        }).then(res => {
          if (res && res.success) {
            // this.refresh();
            messageList[index].messageId = res.rows;
            messageList[index]._status = '';
            messageList[index].messageCode = fieldsValue.messageCode;
            messageList[index].message = fieldsValue.message;
            messageList[index].module = fieldsValue.module;
            messageList[index].moduleDesc =
              messageList[index].changeModuleDesc || messageList[index].moduleDesc;
            dispatch({
              type: 'errorMessage/updateState',
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
  deleteMessage() {
    const {
      errorMessage: { messageList = [] },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'errorMessage/deleteMessage',
      payload: messageList
        .filter(ele => selectedRows.some(eles => eles === ele.messageId))
        .map(ele => ({
          messageCode: ele.messageCode,
          messageId: ele.messageId,
          module: ele.module,
        })),
    }).then(res => {
      if (res && res.success) {
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
      errorMessage: { messageList = [] },
    } = this.props;
    messageList[index].changeModuleDesc = record.description;
    dispatch({
      type: 'errorMessage/updateState',
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
      errorMessage: { messageList = [], messagePagination = {} },
      fetchMessageLoading,
      deleteLoading,
      tenantId,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.messageCode`).d('消息编码'),
        width: 200,
        dataIndex: 'messageCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`messageCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.messageCode`).d('消息编码'),
                    }),
                  },
                ],
                initialValue: record.messageCode,
              })(<Input disabled={record.messageId} inputChinese={false} trim typeCase="upper" />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.message`).d('消息内容'),
        dataIndex: 'message',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`message`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.message`).d('消息内容'),
                    }),
                  },
                ],
                initialValue: record.message,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.message`).d('消息内容')}
                  field="message"
                  dto="io.tarzan.common.domain.entity.MtErrorMessage"
                  pkValue={{ messageId: record.messageId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.moduleDesc`).d('服务包'),
        dataIndex: 'moduleDesc',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`module`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.moduleDesc`).d('服务包'),
                    }),
                  },
                ],
                initialValue: record.module,
              })(
                <Lov
                  code="MT.SERVICE_PACKAGE"
                  onChange={(vals, records) => this.updateState(vals, records, index)}
                  queryParams={{ tenantId }}
                  textValue={val}
                />
              )}
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
                  {intl.get('tarzan.hmes.message.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditMessage(record, true)}>
                {intl.get('tarzan.hmes.message.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveMessage(record, index)}>
                  {intl.get('tarzan.hmes.message.button.save').d('保存')}
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
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.message.title.list').d('消息维护')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateMessage}>
            {intl.get('tarzan.hmes.message.button.create').d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button
              icon="delete"
              loading={deleteLoading}
              disabled={selectedRows.length === 0}
              // onClick={this.deleteType}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteMessage}
            >
              <Button
                icon="delete"
                disabled={selectedRows.length === 0}
                loading={deleteLoading}
                // onClick={this.deleteMessage}
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
            rowKey="messageId"
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
