import React, {Component, Fragment} from 'react';
import {Button, Form, Input, Select, InputNumber} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import {tableScrollWidth} from 'utils/utils';



export default class ListTable extends Component {

  @Bind()
  handleFetchHisRecord(record = {}) {
    const { handleFetchHisRecord } = this.props;
    if(record._status !== 'create' && record._status !== 'update'){
      if(handleFetchHisRecord) {
        handleFetchHisRecord(record);
      }
    }
  }

  render() {

    const {
      tenantId,
      pagination,
      dataSource,
      enableFlag,
      selectedKeys = [],
      handleDeleteLimit,
      handleAddLimit,
      handleCleanLine,
      handleEditLine,
      loading,
      delLoading,
      onChange,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: '事业部',
        dataIndex: 'departmentCode',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`departmentId`, {
                initialValue: record.departmentCode,
                rules: [
                  {
                    required: true,
                    message: '事业部',
                  },
                ],
              })(
                <Lov
                  code="HME.STOCKTAKE_AREA"
                  queryParams={{ tenantId }}
                  lovOptions={{
                    displayField: 'areaCode',
                    valueField: 'areaId',
                  }}
                  textValue={record.departmentCode}
                  onChange={() => {
                    record.$form.resetFields('workcellCode');
                    record.$form.resetFields('workcellName');
                  }}
                />
              )}
            </Form.Item>
          ): (val),
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 130,
        render: (val, record) =>
          ['create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialCode`, {
                initialValue: record.materialCode,
                rules: [
                  {
                    required: true,
                    message: '物料编码',
                  },
                ],
              })(
                <Lov
                  code="Z.MATERIALCODE"
                  queryParams={{ tenantId }}
                  lovOptions={{
                    displayField: 'materialCode',
                    valueField: 'materialCode',
                  }}
                  textValue={record.materialCode}
                  onChange={(_val, item) => {
                    record.$form.setFieldsValue({materialName: item.materialName, materialId: item.materialId});
                  }}
                />
              )}
            </Form.Item>
            ) : (val),
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      width: 150,
      render: (val, record) =>
        ['create'].includes(record._status) ? (
          <span>
            <Form.Item>
              {record.$form.getFieldDecorator(`materialName`, {
                initialValue: record.materialName,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: record.materialId,
                })(<Input disabled />)}
            </Form.Item>
          </span>
        ) : (val),
      },
      {
        title: '工序编码',
        dataIndex: 'workcellCode',
        width: 130,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`workcellCode`, {
                initialValue: record.materialCode,
                rules: [
                  {
                      required: true,
                      message: '工序编码',
                  },
                ],
              })(
                <Lov
                  code="HME.FINAL_PROCESS"
                  queryParams={{
                    departmentId: record.$form.getFieldValue('departmentId'),
                    tenantId,
                  }}
                  lovOptions={{
                    displayField: 'workcellCode',
                    valueField: 'workcellCode',
                  }}
                  textValue={record.workcellCode}
                  onChange={(_val, item) => {
                    record.$form.setFieldsValue({workcellName: item.workcellName, workcellId: item.workcellId});
                  }}
                  disabled={isEmpty(record.$form.getFieldValue('departmentId'))}
                />
              )}
            </Form.Item>
          ) : (val),
      },
      {
        title: '工序名称',
        dataIndex: 'workcellName',
        width: 150,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`workcellName`, {
                  initialValue: record.workcellName,
                  })(<Input disabled />)}
              </Form.Item>
              <Form.Item
                style={{ display: 'none' }}
              >
                {record.$form.getFieldDecorator(`workcellId`, {
                  initialValue: record.workcellId,
                  })(<Input disabled />)}
              </Form.Item>
            </span>
          ) : (val),
      },
      {
        title: '限制次数',
        dataIndex: 'limitCount',
        width: 100,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`limitCount`, {
                initialValue: record.limitCount,
                rules: [
                  {
                    required: true,
                    message: '限制次数',
                  }],
                })(<InputNumber precision={0} min={1} style={{width: '80px'}} />)}
            </Form.Item>
          ) : (val),
      },
      {
        title: '有效性',
        dataIndex: 'enableFlagMeaning',
        width: 90,
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                rules: [
                  {
                    required: true,
                    message: '有效性',
                  },
                ],
                initialValue: record.enableFlag,
              })(
                <Select
                  allowClear
                  style={{
                      width: '100%',
                  }}
                >
                  {enableFlag.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (val),
      },
      {
        title: '维护人',
        dataIndex: 'realName',
        width: 120,
      },
      {
        title: '维护时间',
        dataIndex: 'lastUpdateDate',
        width: 140,
      },
      {
        title: '操作',
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (value, record) =>
          record._status === 'create' ? (
            <div className="action-link">
              <a onClick={() => handleCleanLine(record)}>
               清除
              </a>
            </div>
          ) : record._status === 'update' ? (
            <div className="action-link">
              <a onClick={() => handleEditLine(record, false)}>
                取消
              </a>
            </div>
          ) : (
            <a onClick={() => handleEditLine(record, true)}>
              编辑
            </a>
          ),
      },

    ];

    return(
      <Fragment>
        <div className="table-operator">
          <Button onClick={handleAddLimit}>
                新增
          </Button>
          <Button
            style={{display: "none"}}
            onClick={handleDeleteLimit}
            loading={delLoading}
            disabled={selectedKeys.length === 0}
          >
                删除
          </Button>
        </div>
        <EditTable
          bordered
          rowKey="repairLimitCountId"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{
          x: tableScrollWidth(columns),
          }}
          onChange={page => onSearch(page)}
          rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedKeys,
          onChange,
          width: 100,
        }}
        />
      </Fragment>
);
  }
}
