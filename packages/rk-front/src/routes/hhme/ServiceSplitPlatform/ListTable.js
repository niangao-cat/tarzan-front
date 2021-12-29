/*
 * @Description: table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-12 23:46:46
 * @LastEditTime: 2021-03-17 10:18:59
 */
import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';


export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch, selectedRowKeys, onSelectRow, snNum } = this.props;
    const columns = [
      {
        title: '组件SN',
        width: 140,
        dataIndex: 'snNum',
      },
      {
        title: '组件物料',
        width: 140,
        dataIndex: 'materialCode',
      },
      {
        title: '组件描述',
        width: 80,
        dataIndex: 'materialName',
      },
      {
        title: '工单号',
        width: 80,
        dataIndex: 'workOrderNum',
      },
      {
        title: '组件类型',
        width: 120,
        dataIndex: 'itemGroupDescription',
      },
      {
        title: '是否维修',
        width: 120,
        dataIndex: 'isRepairMeaning',
      },
      {
        title: '是否库存管理',
        width: 160,
        dataIndex: 'isOnhandMeaning',
      },
      {
        title: '状态',
        width: 160,
        dataIndex: 'splitStatusMeaning',
      },
      {
        title: '拆机人',
        dataIndex: 'splitByName',
        width: 160,
      },
      {
        title: '拆机时间',
        dataIndex: 'splitTime',
        width: 160,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50) }}
        onChange={page => onSearch(snNum, page)}
        loading={loading}
        rowKey="splitRecordId"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
      />
    );
  }
}
