import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';

export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: "物料编码",
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: "物料描述",
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: "产线编码",
        width: 100,
        dataIndex: 'prodLineCode',
      },
      {
        title: "产线名称",
        width: 100,
        dataIndex: 'prodLineName',
      },
      {
        title: '工序编码',
        width: 100,
        dataIndex: 'workcellCode',
      },
      {
        title: '工序名称',
        width: 120,
        dataIndex: 'workcellName',
      },
      {
        title: '账面数量',
        width: 120,
        dataIndex: 'currentQuantity',
      },
      {
        title: '初盘数量',
        width: 120,
        dataIndex: 'firstcountQuantity',
      },
      {
        title: '复盘数量',
        width: 120,
        dataIndex: 'recountQuantity',
      },
      {
        title: '初盘差异',
        width: 80,
        dataIndex: 'firstcountDiff',
      },
      {
        title: '复盘差异',
        width: 120,
        dataIndex: 'recountDiff',
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'uomCode',
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
