import React from 'react';
import { Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';


export default class HeadList extends React.Component {

  @Bind()
  handleEdit(record, flag) {
    const { onEdit } = this.props;
    if (onEdit) {
      onEdit('dataLineList', 'ncCodeRouterRelId', record, flag);
    }
  }

  @Bind
  handleSave(record) {
    const { onSave } = this.props;
    if (onSave) {
      onSave(record);
    }
  }

  render() {
    const { loading, pagination, dataSource, rowsSelection, onSearch } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        width: 80,
        render: (val, record, index) => index + 1,
      },
      {
        title: '盘点状态',
        dataIndex: 'equipmentStatusDes',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`remark`).d('盘点备注'),
        dataIndex: 'remark',
        align: 'center',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: val,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '盘点标识',
        dataIndex: 'stocktakeFlagMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '盘点时间',
        dataIndex: 'stocktakeDate',
        width: 100,
        align: 'center',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeDes',
        width: 100,
        align: 'center',
      },
      {
        title: '资产编码',
        dataIndex: 'assetEncoding',
        width: 100,
        align: 'center',
      },
      {
        title: '资产名称',
        dataIndex: 'assetName',
        width: 100,
        align: 'center',
      },
      {
        title: '机身序列号',
        dataIndex: 'equipmentBodyNum',
        width: 100,
        align: 'center',
      },
      {
        title: '型号',
        dataIndex: 'model',
        width: 60,
        align: 'center',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        width: 60,
        align: 'center',
      },
      {
        title: '销售商',
        dataIndex: 'supplier',
        width: 70,
        align: 'center',
      },
      {
        title: '保管部门',
        dataIndex: 'businessName',
        width: 100,
        align: 'center',
      },
      {
        title: '保管人',
        dataIndex: 'preserver',
        width: 70,
        align: 'center',
      },
      {
        title: '存放地点',
        dataIndex: 'location',
        width: 100,
        align: 'center',
      },
      {
        title: '使用频次',
        dataIndex: 'frequencyDes',
        width: 100,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 60,
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 60,
        align: 'center',
      },
      {
        title: '金额',
        dataIndex: 'amount',
        width: 60,
        align: 'center',
      },
      {
        title: '币种',
        dataIndex: 'currencySymbol',
        width: 60,
        align: 'center',
      },
      {
        title: '资产类别',
        dataIndex: 'assetClassDes',
        width: 100,
        align: 'center',
      },
      {
        title: '入账日期',
        dataIndex: 'postingDate',
        width: 100,
        align: 'center',
        render: val => {
          return <span>{val ? val.split(' ')[0] : ''}</span>;
        },
      },
      {
        title: 'SAP流水号',
        dataIndex: 'sapNum',
        width: 100,
        align: 'center',
      },
      {
        title: '配置',
        dataIndex: 'equipmentConfig',
        width: 60,
        align: 'center',
      },
      {
        title: '合同编号',
        dataIndex: 'contractNum',
        width: 100,
        align: 'center',
      },
      {
        title: '募投',
        dataIndex: 'recruitement',
        width: 60,
        align: 'center',
      },
      {
        title: '募投编号',
        dataIndex: 'recruitementNum',
        width: 100,
        align: 'center',
      },
      {
        title: 'OA验收单号',
        dataIndex: 'oaCheckNum',
        width: 100,
        align: 'center',
      },
      {
        title: '是否计量',
        dataIndex: 'measureFlagDes',
        width: 100,
        align: 'center',
      },
      {
        title: '质保期到',
        dataIndex: 'warrantyDate',
        width: 100,
        align: 'center',
        render: val => {
          return <span>{val ? val.split(' ')[0] : ''}</span>;
        },
      },
      {
        title: '详细设备类别',
        dataIndex: 'equipmentCategoryDes',
        width: 100,
        align: 'center',
      },
      {
        title: '当前工位编码',
        dataIndex: 'workcellCode',
        width: 120,
        align: 'center',
      },
      {
        title: '当前工位描述',
        dataIndex: 'workcellName',
        width: 120,
        align: 'center',
      },
      {
        title: '应用类型',
        dataIndex: 'applyTypeDes',
        width: 100,
        align: 'center',
      },
      {
        title: '管理模式',
        dataIndex: 'attribute1Meaning',
        width: 100,
        align: 'center',
      },
      {
        title: '台账类别',
        dataIndex: 'ledgerTypeMeaning',
        width: 70,
        align: 'center',
      },
      {
        title: '处置单号',
        dataIndex: 'dealNum',
        width: 100,
        align: 'center',
      },
      {
        title: '处置原因',
        dataIndex: 'dealReason',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        width: 100,
        fixed: 'right',
        render: (val, record) =>
          record._status === 'update' ? (
            <span>
              <a onClick={() => this.handleEditLine(record, false)}>取消</a>&nbsp;&nbsp;
              <a onClick={() => this.handleSaveLine(record)}>保存</a>
            </span>
          ) : (
            <a onClick={() => this.handleEditLine(record, true)}>编辑</a>
          ),
      },
    ];

    return (
      <EditTable
        bordered
        dataSource={dataSource}
        rowKey="ncCodeRouterRelId"
        columns={columns}
        rowSelection={rowsSelection}
        pagination={pagination}
        onChange={onSearch}
        loading={loading}
        scroll={{ x: tableScrollWidth(columns) }}
      />
    );
  }
}
