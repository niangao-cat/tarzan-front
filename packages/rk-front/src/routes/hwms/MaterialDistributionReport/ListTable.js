import React from 'react';
import { Bind } from 'lodash-decorators';
import { Table } from 'hzero-ui';

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
    const { loading, dataSource, pagination } = this.props;
    const columns = [
      {
        title: '序号',
        width: 60,
        dataIndex: 'sequence',
      },
      {
        title: '工厂',
        width: 90,
        dataIndex: 'siteCode',
      },
      {
        title: '日期',
        width: 140,
        dataIndex: 'nowDate',
      },
      {
        title: '生产线',
        width: 90,
        dataIndex: 'prodLineCode',
      },
      {
        title: '工段',
        width: 90,
        dataIndex: 'workcellCode',
      },
      {
        title: '物料编码',
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: '物料版本',
        width: 90,
        dataIndex: 'materialVersion',
      },
      {
        title: '当日需求总数',
        dataIndex: 'currentDemandQty',
        width: 90,
      },
      {
        title: '已配送数量',
        width: 90,
        dataIndex: 'distributedQty',
      },
      {
        title: '当日需求缺口',
        width: 90,
        dataIndex: 'demandGapQty',
      },
      {
        title: '线边库存',
        width: 90,
        dataIndex: 'workcellQty',
      },
      {
        title: '预计停线时间',
        dataIndex: 'estimatedStopTime',
        width: 90,
      },
      {
        title: '后三日需求总数',
        dataIndex: 'futureDemandQty',
        width: 120,
      },
      {
        title: '库存量',
        dataIndex: 'inventoryQty',
        width: 120,
      },
      {
        title: '库存缺口',
        dataIndex: 'inventoryGapQty',
        width: 120,
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
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
