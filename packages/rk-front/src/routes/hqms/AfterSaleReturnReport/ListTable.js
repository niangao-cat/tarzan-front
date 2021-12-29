import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';


export default class HeadTable extends React.Component {

  @Bind()
  handleSearch(page) {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch(page);
    }
  }

  render() {
    const { loading, pagination, dataSource } = this.props;
    const columns = [
      {
        title: '接收SN',
        width: 80,
        dataIndex: 'snNum',
      },
      {
        title: '翻新SN',
        width: 100,
        dataIndex: 'refurbishSnNum',
      },
      {
        title: '当前SN状态',
        width: 80,
        dataIndex: 'receiveStatusMeaning',
      },
      {
        title: '产品编码',
        width: 80,
        dataIndex: 'materialCode',
      },
      {
        title: '产品描述',
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: '型号',
        width: 120,
        dataIndex: 'model',
      },
      {
        title: '退库检测人',
        width: 120,
        dataIndex: 'returnCheckUserName',
      },
      {
        title: '退库检测时间',
        dataIndex: 'returnCheckDate',
        width: 120,
      },
      {
        title: '退库检测工位编码',
        width: 90,
        dataIndex: 'returnCheckWorkcellCode',
      },
      {
        title: '退库检测工位描述',
        width: 100,
        dataIndex: 'returnCheckWorkcellName',
      },
      {
        title: '当前工位编码',
        width: 100,
        dataIndex: 'workcellCode',
      },
      {
        title: '当前工位描述',
        dataIndex: 'workcellName',
        width: 100,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={this.handleSearch}
        loading={loading}
        rowKey="stocktakeId"
      />
    );
  }
}
