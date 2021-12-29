import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.soDeliveryQuery.model.soDeliveryQuery';
    const { loading, dataSource, pagination, onSearch, onSelectRow, selectedRowKeys } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.soDeliveryLineNum`).d('出货单行号'),
        dataIndex: 'instructionLineNum',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.lineStatus`).d('行状态'),
        dataIndex: 'instructionStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.demandQty`).d('需求数'),
        dataIndex: 'quantity',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('实发数'),
        dataIndex: 'actualQty',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.boxQty`).d('箱数'),
        dataIndex: 'boxQty',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.containerQty`).d('托数'),
        dataIndex: 'containerQty',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.boxQtyPerContainer`).d('每托箱数'),
        dataIndex: 'boxQtyPerContainer',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.packDetail`).d('打托明细'),
        dataIndex: 'packDetail',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.customerItemCode`).d('客户产品编码'),
        dataIndex: 'customerItemCode',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.soNum`).d('销售订单号'),
        dataIndex: 'sourceOrderId',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.soLineNum`).d('销售订单行号'),
        dataIndex: 'sourceOrderLineId',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.soRemark`).d('销售订单长文本'),
        dataIndex: 'soRemark',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.freeOrValuation`).d('赠品/计价标识'),
        dataIndex: 'freeOrValuation',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 200 }}
        rowSelection={{
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
