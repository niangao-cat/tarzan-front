import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.purchaseReturn.model.purchaseReturn';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt2}.docLineNum`).d('行号'),
        dataIndex: 'instructionLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPromt2}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商名称'),
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.quantity`).d('退货数'),
        dataIndex: 'quantity',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt2}.actualQty`).d('执行数'),
        dataIndex: 'actualQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt2}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.sourceOrder`).d('采购订单号'),
        dataIndex: 'sourceOrderId',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.sourceOrderLine`).d('采购订单行号'),
        dataIndex: 'sourceOrderLineId',
        width: 150,
      },
      {
        title: intl.get(`${modelPromt2}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          type: 'radio',
          fixed: true,
          columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTableLine;
