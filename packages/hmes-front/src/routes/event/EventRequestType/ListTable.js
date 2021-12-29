/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Badge, Input, Switch, notification } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
// getEditTableData,
import { delItemToPagination } from 'utils/utils';

const modelPrompt = 'tarzan.event.requestType.model.requestType';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} eventRequestType - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventRequestType, loading }) => ({
  eventRequestType,
  fetchLoading: loading.effects['eventRequestType/fetchEventRequestTypeList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({ code: 'tarzan.event.requestType' })
export default class ListTable extends React.Component {
  /**
   * 编辑事件请求类型
   */
  @Bind()
  handleEditEventRequestType(record, flag) {
    const {
      dispatch,
      eventRequestType: { eventRequestTypeList },
    } = this.props;
    const newList = eventRequestTypeList.map(item => {
      if (record.requestTypeId === item.requestTypeId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'eventRequestType/updateState',
      payload: { eventRequestTypeList: newList },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      eventRequestType: { eventRequestTypeList, eventRequestTypePagination },
    } = this.props;
    const newList = eventRequestTypeList.filter(
      item => item.requestTypeId !== record.requestTypeId
    );
    dispatch({
      type: 'eventRequestType/updateState',
      payload: {
        eventRequestTypeList: newList,
        eventRequestTypePagination: delItemToPagination(
          eventRequestTypeList.length,
          eventRequestTypePagination
        ),
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
      eventRequestType: { eventRequestTypeList, eventRequestTypePagination },
    } = this.props;
    const newList = eventRequestTypeList.filter(
      item => item.requestTypeId !== record.requestTypeId
    );
    dispatch({
      type: 'eventRequestType/updateState',
      payload: {
        eventRequestTypeList: newList,
        eventRequestTypePagination: delItemToPagination(
          eventRequestTypeList.length,
          eventRequestTypePagination
        ),
      },
    });
  }

  // 保存事件请求类型
  @Bind
  handleSaveEventRequestType(record, index) {
    const {
      dispatch,
      eventRequestType: { eventRequestTypeList = [] },
    } = this.props;
    // const params = getEditTableData(eventRequestTypeList, ['requestTypeId']);
    // console.log(params,eventRequestTypeList)s
    // params[0].enableFlag = params[0].enableFlag ? 'Y' : 'N';
    record.$form.validateFields((err, value) => {
      if (!err) {
        dispatch({
          type: 'eventRequestType/saveEventRequestType',
          payload: {
            ...value,
            enableFlag: value.enableFlag ? 'Y' : 'N',
            requestTypeId: record.requestTypeId,
            requestTypeCode: value.requestTypeCode,
            description: value.description,
          },
        }).then(res => {
          if (res && res.success) {
            eventRequestTypeList[index] = {
              requestTypeCode: value.requestTypeCode,
              description: value.description,
              enableFlag: value.enableFlag,
              requestTypeId: res.rows,
            };
            dispatch({
              type: 'eventRequestType/updateState',
              payload: {
                eventRequestTypeList,
              },
            });
          } else if (res) {
            notification.error({
              message: res.message,
            });
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
  handleTableChange(pagination = {}) {
    const {
      handleTableChange,
      // eventRequestType: { eventRequestTypePagination = {} },
    } = this.props;
    handleTableChange(pagination);
    // this.fetchQueryList(eventRequestTypePagination);
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      eventRequestType: { eventRequestTypeList = [], eventRequestTypePagination = {} },
      fetchLoading,
      handleTableChange,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.requestTypeCode`).d('事件请求编码'),
        dataIndex: 'requestTypeCode',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`requestTypeCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.requestTypeCode`).d('事件请求编码'),
                    }),
                  },
                ],
                initialValue: record.requestTypeCode,
              })(<Input typeCase="upper" inputChinese={false} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('描述'),
        dataIndex: 'description',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: record.description,
              })(
                <TLEditor
                  label="描述"
                  field="description"
                  pkValue={{ requestTypeId: record.requestTypeId }}
                  dto="tarzan.general.domain.entity.MtEventRequestType"
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
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag !== 'N',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag !== 'N' ? 'success' : 'error'}
              text={
                record.enableFlag !== 'N'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
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
                <a onClick={() => this.handleEditEventRequestType(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEventRequestType(record, index)}>
                  {intl.get('tarzan.event.requestType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditEventRequestType(record, true)}>
                {intl.get('tarzan.event.requestType.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEventRequestType(record, index)}>
                  {intl.get('tarzan.event.requestType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];

    return (
      <EditTable
        loading={fetchLoading}
        rowKey="requestTypeId"
        dataSource={eventRequestTypeList}
        columns={columns}
        pagination={eventRequestTypePagination || {}}
        onChange={handleTableChange}
        bordered
      />
    );
  }
}
