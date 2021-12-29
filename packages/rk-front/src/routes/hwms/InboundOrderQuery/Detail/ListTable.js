import React from 'react';
import { Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';

export default class HeadTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: '行号',
        width: 100,
        dataIndex: 'lineNum',
      },
      {
        title: '实物条码',
        width: 100,
        dataIndex: 'materialLotCode',
      },
      {
        title: '条码状态',
        width: 120,
        dataIndex: 'materialLotStatusMeaning',
      },
      {
        title: '质量状态',
        width: 80,
        dataIndex: 'qualityStatusMeaning',
        align: 'center',
      },
      {
        title: '容器条码',
        width: 80,
        dataIndex: 'containerCode',
      },
      {
        title: '物料编码',
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: '物料版本',
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: '物料描述',
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: '数量',
        width: 120,
        dataIndex: 'quantity',
      },
      {
        title: '单位',
        width: 120,
        dataIndex: 'uom',
      },
      {
        title: '销售订单号',
        width: 120,
        dataIndex: 'soNum',
      },
      {
        title: '销售订单行号',
        width: 120,
        dataIndex: 'soLineNum',
      },
      {
        title: '批次号',
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: '生产订单号',
        width: 120,
        dataIndex: 'woNum',
      },
      {
        title: '仓库',
        width: 120,
        dataIndex: 'warehouseCode',
      },
      {
        title: '货位',
        width: 120,
        dataIndex: 'locatorCode',
      },
      {
        title: '入库时间',
        width: 120,
        dataIndex: 'receiptDate',
      },
      {
        title: '执行人',
        width: 120,
        dataIndex: 'executedByName',
      },

    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page)}
        scroll={{ x: tableScrollWidth(columns) }}
        loading={loading}
        rowKey="exceptionId"
      />
    );
  }
}
