/**
 * ListTable -表格
 * @date: 2021-03-03
 * @author:  <junfeng.chen@hand-china.com>
 * @version: 0.0.1
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import { changeTableRowEditState, getEditRecord } from '@/utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';

const modelPrompt = 'hhme.ageningData.model.ageningData';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 *表格
 * @extends {Component} - React.Component
 * @reactProps {Object} ageningData - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ ageningData, loading }) => ({
  ageningData,
  fetchAgeningDataLoading: loading.effects['ageningData/fetchAgeningDataList'],
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
      type: 'ageningData/fetchAgeningDataList',
      payload: {
        ...params,
        page: pagination,
      },
    });
  }

  /**
   * 编辑
   */
  @Bind()
  handleEditAgeningData(record) {
    const {
      dispatch,
      ageningData: { ageningDataList },
    } = this.props;
    dispatch({
      type: 'ageningData/updateState',
      payload: { ageningDataList: changeTableRowEditState(record, ageningDataList, 'basicId') },
    });
  }

  // 取消编辑
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      ageningData: { ageningDataList, ageningDataPagination },
    } = this.props;
    const newList = ageningDataList.filter(item => item.basicId !== record.basicId);
    dispatch({
      type: 'ageningData/updateState',
      payload: {
        ageningDataList: newList,
        ageningDataPagination: delItemToPagination(ageningDataList.length, ageningDataPagination),
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
      ageningData: { ageningDataList },
    } = this.props;
    const newList = ageningDataList.filter(item => item.basicId !== record.basicId);
    dispatch({
      type: 'ageningData/updateState',
      payload: {
        ageningDataList: newList,
      },
    });
  }

  // 保存消息
  @Bind
  handleSaveAgeningData(record) {
    const {
      dispatch,
      ageningData: { ageningDataList },
    } = this.props;
    const needChangeFlags = ['enableFlag'];
    record.$form.validateFields(err => {
      if (!err) {
        const params = getEditRecord(record, ageningDataList, 'basicId', needChangeFlags);
        dispatch({
          type: 'ageningData/saveAgeningData',
          payload: {
            ...params,
          },
        }).then(res => {
          if (res ) {

            notification.success();
            // 重新查询
            dispatch({
              type: 'ageningData/fetchAgeningDataList',
            });
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
      statusMap,
      ageningData: { ageningDataList = [], ageningDataPagination = {} },
      fetchAgeningDataLoading,
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('产品编码'),
        width: 100,
        dataIndex: 'materialCode',
        render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`materialId`, {
              initialValue: record.materialId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialId`).d('产品编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="MT.MATERIAL"
                textValue={val}
                queryParams={{ tenantId }}
              />
            )}
          </Form.Item>
        ) : (
            val
          ),
    },
    {
      title: intl.get(`${modelPrompt}.materialName`).d('产品描述'),
      width: 100,
      dataIndex: 'materialName',
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`materialName`, {
              initialValue: record.materialName,
            })(<Input disabled />)}
          </Form.Item>
        ) : (
          val
        ),
    },
    {
      title: intl.get(`${modelPrompt}.cosModel`).d('芯片类型'),
      width: 100,
      dataIndex: 'cosModel',
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`cosModel`, {
              initialValue: record.cosModel,
            })(<Input trim />)}
          </Form.Item>
        ) : (
          val
        ),
    },
    {
      title: intl.get(`${modelPrompt}.chipCombination`).d('芯片组合'),
      dataIndex: 'chipCombination',
      width: 240,
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('chipCombination', {
              initialValue: record.chipCombination,
            })(<Input trim />)}
          </Form.Item>
        ) : (
          val
        ),
    },
    {
      title: intl.get(`${modelPrompt}.current`).d('电流(A)'),
      dataIndex: 'current',
      width: 240,
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('current', {
              initialValue: record.current,
            })(<Input trim />)}
          </Form.Item>
        ) : (
          val
        ),
    },
    {
      title: intl.get(`${modelPrompt}.duration`).d('时长(h)'),
      width: 100,
      dataIndex: 'duration',
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`duration`, {
              initialValue: record.duration,
            })(<Input trim />)}
          </Form.Item>
        ) : (
          val
        ),
    },
    {
      title: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
      dataIndex: 'enableFlagMeaning',
      width: 100,
      align: 'center',
      render: (val, record) =>
        ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator('enableFlag', {
              initialValue: record.enableFlag,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {statusMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
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
        render: (_, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditAgeningData(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveAgeningData(record)}>
                  {intl.get('hhme.ageningData.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!['create', 'update'].includes(record._status) && (
              <a onClick={() => this.handleEditAgeningData(record)}>
                {intl.get('hhme.ageningData.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSaveAgeningData(record)}>
                  {intl.get('hhme.ageningData.button.save').d('保存')}
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
          loading={fetchAgeningDataLoading}
          rowKey="basicId"
          dataSource={ageningDataList}
          columns={columns}
          pagination={ageningDataPagination || {}}
          onChange={this.fetchQueryList}
          bordered
        />
      </React.Fragment>
    );
  }
}
