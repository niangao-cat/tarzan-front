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
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { delItemToPagination } from 'utils/utils';
import { changeTableRowEditState, getEditRecord, updateTableRowData } from '@/utils/utils';
import notification from 'utils/notification';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';

const modelPrompt = 'tarzan.org.enterprise.model.enterprise';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *表格
 * @extends {Component} - React.Component
 * @reactProps {Object} enterprise - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ enterprise, loading }) => ({
  enterprise,
  fetchEnterpriseLoading: loading.effects['enterprise/fetchEnterpriseList'],
}))
@Form.create({ fieldNameProp: null })
export default class ListTable extends React.Component {
  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { dispatch, filterForm } = this.props;

    let params = {};
    if (filterForm) {
      filterForm.validateFields((err, values) => {
        if (!err) {
          params = values;
        }
      });
    }

    dispatch({
      type: 'enterprise/fetchEnterpriseList',
      payload: {
        ...params,
        page: pagination,
      },
    });
  }

  /**
   * 编辑消息
   */
  @Bind()
  handleEditEnterprise(record) {
    const {
      dispatch,
      enterprise: { enterpriseList },
    } = this.props;
    dispatch({
      type: 'enterprise/updateState',
      payload: { enterpriseList: changeTableRowEditState(record, enterpriseList, 'enterpriseId') },
    });
  }

  // 取消编辑替代组
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      enterprise: { enterpriseList, enterprisePagination },
    } = this.props;
    const newList = enterpriseList.filter(item => item.enterpriseId !== record.enterpriseId);
    dispatch({
      type: 'enterprise/updateState',
      payload: {
        enterpriseList: newList,
        enterprisePagination: delItemToPagination(enterpriseList.length, enterprisePagination),
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
      enterprise: { enterpriseList },
    } = this.props;
    const newList = enterpriseList.filter(item => item.enterpriseId !== record.enterpriseId);
    dispatch({
      type: 'enterprise/updateState',
      payload: {
        enterpriseList: newList,
      },
    });
  }

  // 保存消息
  @Bind
  handleSaveEnterprise(record) {
    const {
      dispatch,
      enterprise: { enterpriseList },
    } = this.props;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, enterpriseList, 'enterpriseId', needChangeFlags);
        dispatch({
          type: 'enterprise/saveEnterprise',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res && res.success) {
            dispatch({
              type: 'enterprise/updateState',
              payload: {
                enterpriseList: updateTableRowData(res.rows, enterpriseList, 'enterpriseId'),
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
   * 渲染方法
   * @returns
   */
  render() {
    const {
      enterprise: { enterpriseList = [], enterprisePagination = {} },
      fetchEnterpriseLoading,
    } = this.props;

    const columns = [
      {
        title: intl.get(`${modelPrompt}.enterpriseCode`).d('企业编码'),
        width: 100,
        dataIndex: 'enterpriseCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enterpriseCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.enterpriseCode`).d('企业编码'),
                    }),
                  },
                ],
                initialValue: record.enterpriseCode,
              })(<Input typeCase="upper" inputChinese={false} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enterpriseName`).d('企业名称'),
        dataIndex: 'enterpriseName',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enterpriseName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.enterpriseName`).d('企业名称'),
                    }),
                  },
                ],
                initialValue: record.enterpriseName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.enterpriseName`).d('企业名称')}
                  field="enterpriseName"
                  dto="tarzan.modeling.domain.entity.MtModEnterprise"
                  pkValue={{ enterpriseId: record.enterpriseId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enterpriseShortName`).d('企业简称'),
        dataIndex: 'enterpriseShortName',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enterpriseShortName`, {
                initialValue: record.enterpriseShortName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.enterpriseShortName`).d('企业简称')}
                  field="enterpriseShortName"
                  dto="tarzan.modeling.domain.entity.MtModEnterprise"
                  pkValue={{ enterpriseId: record.enterpriseId || null }}
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
        width: 200,
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
        width: 150,
        align: 'center',
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditEnterprise(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEnterprise(record)}>
                  {intl.get('tarzan.org.enterprise.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEditEnterprise(record)}>
                {intl.get('tarzan.org.enterprise.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveEnterprise(record)}>
                  {intl.get('tarzan.org.enterprise.button.save').d('保存')}
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
          loading={fetchEnterpriseLoading}
          rowKey="enterpriseId"
          dataSource={enterpriseList}
          columns={columns}
          pagination={enterprisePagination || {}}
          onChange={this.fetchQueryList}
          bordered
        />
      </React.Fragment>
    );
  }
}
