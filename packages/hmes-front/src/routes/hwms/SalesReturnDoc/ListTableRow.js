/**
 *销售退单号
 *@date：2019/11/9
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.salesReturnDocQuery.model.salesReturnDocQuery';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.lineNum`).d('行号'),
        width: 140,
        dataIndex: 'lineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.lineStatus`).d('行状态'),
        width: 120,
        align: 'center',
        dataIndex: 'lineStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.salesReturnQty`).d('退货数'),
        width: 150,
        align: 'center',
        dataIndex: 'salesReturnQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('执行数'),
        width: 150,
        align: 'center',
        dataIndex: 'actualQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        width: 150,
        dataIndex: 'uom',
      },
      {
        title: intl.get(`${commonModelPrompt}.originalInvoiceNum`).d('原发票号'),
        width: 150,
        align: 'center',
        dataIndex: 'originalInvoiceNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.soDeliveryNum`).d('出货单号'),
        width: 150,
        align: 'center',
        dataIndex: 'soDeliveryNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.soDeliveryLineNum`).d('出货单行号'),
        width: 150,
        align: 'center',
        dataIndex: 'soDeliveryLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.soNum`).d('销售订单号'),
        width: 150,
        align: 'center',
        dataIndex: 'soNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.soLineNum`).d('销售订单行号'),
        width: 150,
        dataIndex: 'soLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.soLongText`).d('销售订单长文本'),
        width: 150,
        dataIndex: 'soLongText',
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
        scroll={{ x: tableScrollWidth(columns, 50), y: 250 }}
        rowSelection={{
          selectedRowKeys,
          fixed: true,
          columnWidth: 50,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
