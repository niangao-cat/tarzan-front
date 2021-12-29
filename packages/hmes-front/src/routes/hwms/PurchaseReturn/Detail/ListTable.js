import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.purchaseReturn.model.purchaseReturn';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt2}.docLineNum`).d('单据行号'),
        dataIndex: 'instructionLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.materialLotStatus`).d('条码状态'),
        dataIndex: 'materialLotStatus',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityStatus`).d('条码质量状态'),
        dataIndex: 'qualityStatus',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.executeQuantity`).d('执行数量'),
        dataIndex: 'materialLotQty',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt2}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPromt2}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.lot`).d('批次'),
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${modelPromt2}.warehouseCode`).d('仓库编码'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.locatorCode`).d('库位编码'),
        dataIndex: 'subLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.sourceOrder`).d('采购订单号'),
        dataIndex: 'sourceOrderId',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.sourceOrderLine`).d('采购订单行号'),
        dataIndex: 'sourceOrderLineId',
      },
    ];
    return (
      <Table
        bordered
        rowKey="actualDetailId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
