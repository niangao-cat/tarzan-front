/*
 * @Description: 工装基础数据
 * @version: 0.1.0
 * @Author: li.zhang13@hand-china.com
 * @Date: 2021-01-07 17:48:27
 */

import React, { Component } from 'react';
import { Form, Input, Badge, Select, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth, getCurrentOrganizationId } from 'utils/utils';

const { Option } = Select;
@Form.create({ fieldNameProp: null })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  //修改记录查询
  @Bind()
  historyClick(record, index){
    const { historyClick } = this.props;
    historyClick(record, index);
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      dataList,
      fetchLoading,
      pagination,
      onSearch,
      handleCleanLine,  //清除新增
      handleEditLine,   //编辑取消设置工位显示字段
      onchange,    //设置工位显示字段
      onchangeuom, //设置单位显示字段
      applyTypeMap,
    } = this.props;
    const columns = [
      {
        title: '部门',
        dataIndex: 'areaName1',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`areaId`, {
                rules: [
                  {
                    required: true,
                    message: '部门不能为空',
                  },
                ],
                initialValue: record.areaId,
              })(
                <Lov
                  code="HME.BUSINESS_AREA"
                  textValue={record.areaName1}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '车间',
        dataIndex: 'areaName2',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`areaCode`, {
                rules: [
                  {
                    required: true,
                    message: '车间不能为空',
                  },
                ],
                initialValue: record.areaCode,
              })(
                <Lov
                  code="HME_WORK_SHOP"
                  textValue={record.areaName2}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  onChange={(value, item) => {
                    record.$form.setFieldsValue({
                      areaCode: item.areaId,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工位',
        dataIndex: 'workcellName',
        width: 130,
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellId`, {
                initialValue: record.workcellId,
                rules: [
                  {
                    required: true,
                    message: '工位不能为空',
                  },
                ],
              })(
                <Lov
                  code="MT.WORK_STATION"
                  textValue={record.workcellName}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  onChange={(value, item) => {
                    onchange(item,index);
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '工具名称',
        dataIndex: 'toolName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`toolName`, {
                initialValue: record.toolName,
                rules: [
                  {
                    required: true,
                    message: '工具名称不能为空',
                  },
                ],
              })(
                <Input/>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`brandName`, {
                initialValue: record.brandName,
              })(
                <Input/>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '规格型号',
        dataIndex: 'specification',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`specification`, {
                initialValue: record.specification,
              })(
                <Input/>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '单位',
        dataIndex: 'uomName',
        width: 130,
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`uomId`, {
                initialValue: record.uomId,
                rules: [
                  {
                    required: true,
                    message: '单位不能为空',
                  },
                ],
              })(
                <Lov
                  code="MT.UOM"
                  textValue={record.uomName}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  onChange={(value, item) => {
                    onchangeuom(item,index);
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数量',
        dataIndex: 'qty',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`qty`, {
                initialValue: record.qty,
                rules: [
                  {
                    required: true,
                    message: '数量不能为空',
                  },
                ],
              })(
                <InputNumber/>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '使用频率',
        dataIndex: 'rate',
        width: 130,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`rate`, {
                initialValue: record.rate,
              })(
                <Input/>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: ('应用类型'),
        dataIndex: 'applyTypeMeaning',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('applyType', {
                initialValue: record.applyType,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {applyTypeMap.map(item => (
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
        title: '启用状态',
        dataIndex: 'enableFlag',
        width: 110,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Select style={{ width: '100%' }}>
                  <Option value='Y' key='Y'>启用</Option>
                  <Option value="N" key='N'>禁用</Option>
                </Select>
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                  record.enableFlag === 'Y'
                    ? '启用'
                    : '禁用'
                }
            />
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => handleCleanLine(record)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => handleEditLine(record, false, index)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <span>
              <a onClick={() => handleEditLine(record, true , index)}>编辑</a>&nbsp;
              <a onClick={() => this.historyClick(record, index)}>修改记录</a>
            </span>
              ),
      },
    ];
    return (
      <EditTable
        bordered
        rowKey="toolId"
        columns={columns}
        loading={fetchLoading}
        dataSource={dataList}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
