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
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPromp2 = 'hwms.woPlatform.model.woPlatform';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 80,
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码号'),
        dataIndex: 'barcode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotStatus`).d('条码状态'),
        dataIndex: 'barecodeStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPromp2}.executeQuantity`).d('执行数量'),
        dataIndex: 'executeQuantity',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        dataIndex: 'unit',
        width: 100,
      },
      {
        title: intl.get(`${modelPromp2}.executeTime`).d('执行时间'),
        dataIndex: 'executeTime',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库编码'),
        dataIndex: 'warehouse',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('库位编码'),
        dataIndex: 'locator',
      },
    ];
    return (
      <Table
        bordered
        rowKey="id"
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
