import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.solderGlueManage.model.solderGlueManage';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('锡膏瓶码'),
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'solderGlueStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.prodLine`).d('产线'),
        dataIndex: 'recipientsProdLine',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.operator`).d('操作人'),
        dataIndex: 'operator',
        width: 120,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
