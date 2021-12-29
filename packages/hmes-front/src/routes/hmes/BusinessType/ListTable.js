/**
 * ListTable -表格
 * @date: 2019-8-8
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Switch, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';

const modelPrompt = 'tarzan.org.businessType.model.businessType';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *表格
 * @extends {Component} - React.Component
 * @reactProps {Object} businessType - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ businessType, loading }) => ({
  businessType,
  fetchbusinessTypeLoading: loading.effects['businessType/fetchBusinessTypeList'],
}))
@Form.create({ fieldNameProp: null })
export default class ListTable extends React.Component {
  /**
   * 编辑消息
   */
  @Bind()
  handleEditbusinessType(record) {
    const {
      dispatch,
      businessType: { businessTypeList },
    } = this.props;
    dispatch({
      type: 'businessType/updateState',
      payload: {
        businessTypeList: changeTableRowEditState(record, businessTypeList, 'relationId'),
      },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine() {
    const {
      dispatch,
      businessType: { businessTypeList, businessTypePagination },
    } = this.props;
    businessTypeList.shift();
    dispatch({
      type: 'businessType/updateState',
      payload: {
        businessTypeList,
        businessTypePagination: delItemToPagination(
          businessTypeList.length,
          businessTypePagination
        ),
      },
    });
  }

  // 保存消息
  @Bind
  async handleSavebusinessType(record, index) {
    const {
      dispatch,
      businessType: { businessTypeList },
    } = this.props;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, businessTypeList, 'relationId', needChangeFlags);
        const checkRes = businessTypeList.filter(
          item => item.businessType === params.businessType && item.relationId !== params.relationId
        ).length;
        if (checkRes) {
          notification.error({ message: '业务类型已存在,请检查。' });
          return;
        }
        dispatch({
          type: 'businessType/saveBusinessType',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            if (record._status === 'update') {
              businessTypeList[index]._status = '';
            }
            dispatch({
              type: 'businessType/updateState',
              payload: {
                businessTypeList: updateTableRowData(res.rows, businessTypeList, 'relationId'),
              },
            });
            notification.success();
          }
        });
      }
    });
  }

  // 带出业务类型lov值
  changeBusinessType = (_, records, record) => {
    record.$form.setFieldsValue({
      businessTypeDesc: records.description,
    });
  };

  // 带出移动类型lov值
  changeInstruction = (_, records, record) => {
    record.$form.setFieldsValue({
      instructionTypeDesc: records.description,
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      businessType: { businessTypeList = [], businessTypePagination = {} },
      fetchbusinessTypeLoading,
    } = this.props.ListProps;
    const { onSearch } = this.props;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: intl.get(`${modelPrompt}.businessType`).d('业务类型'),
        width: 200,
        dataIndex: 'businessType',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`businessType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.businessType`).d('业务类型'),
                    }),
                  },
                ],
                initialValue: record.businessType,
              })(
                <Lov
                  textValue={record.businessType}
                  code="MT.BUSINESS_TYPE"
                  onChange={(_, records) => this.changeBusinessType(_, records, record)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.businessTypeDesc`).d('业务类型描述'),
        dataIndex: 'businessTypeDesc',
        width: 230,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`businessTypeDesc`, {
                initialValue: val,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
            record.businessTypeDesc
          ),
      },
      {
        title: intl.get(`${modelPrompt}.instructionType`).d('移动类型'),
        width: 200,
        dataIndex: 'instructionType',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`instructionType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.instructionType`).d('移动类型'),
                    }),
                  },
                ],
                initialValue: record.instructionType,
              })(
                <Lov
                  textValue={record.instructionType}
                  code="MT.INSTRUCTION_TYPE"
                  onChange={(_, records) => this.changeInstruction(_, records, record)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.instructionTypeDesc`).d('移动类型描述'),
        dataIndex: 'instructionTypeDesc',
        width: 230,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`instructionTypeDesc`, {
                initialValue: val,
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
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        render: (_, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditbusinessType(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSavebusinessType(record, index)}>
                  {intl.get('tarzan.org.businessType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEditbusinessType(record)}>
                {intl.get('tarzan.org.businessType.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={this.handleCleanLine}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSavebusinessType(record)}>
                  {intl.get('tarzan.org.businessType.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <React.Fragment>
        <EditTable
          loading={fetchbusinessTypeLoading}
          rowKey="relationId"
          dataSource={businessTypeList}
          columns={columns}
          pagination={businessTypePagination || {}}
          onChange={onSearch}
          bordered
        />
      </React.Fragment>
    );
  }
}
