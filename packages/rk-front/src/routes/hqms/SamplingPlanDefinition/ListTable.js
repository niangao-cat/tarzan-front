/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-30 14:06:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-08 10:30:54
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { loading, dataSource, onSearch, handleAddData, pagination } = this.props;
    const columns = [
      {
        title: '抽样计划类型',
        dataIndex: 'samplePlanTypeMeaning',
        width: 200,
      },
      {
        title: '抽样标准类型',
        dataIndex: 'sampleStandardTypeMeaning',
        width: 150,
      },
      {
        title: '样本量字码',
        dataIndex: 'sampleSizeCodeLetterMeaning',
        width: 200,
      },
      {
        title: '批量上限',
        dataIndex: 'lotUpperLimit',
        width: 150,
      },
      {
        title: '批量下限',
        dataIndex: 'lotLowerLimit',
        width: 150,
      },
      {
        title: 'AQL值',
        dataIndex: 'acceptanceQuantityLimit',
        width: 150,
      },
      {
        title: '抽样数量',
        dataIndex: 'sampleSize',
        width: 100,
      },
      {
        title: 'AC值',
        dataIndex: 'ac',
        width: 100,
      },
      {
        title: 'RE值',
        dataIndex: 're',
        width: 100,
      },
      {
        title: '是否有效',
        dataIndex: 'enableFlagMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: '抽样方案',
        dataIndex: 'attribute1Meaning',
        width: 150,
        align: 'center',
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
        onChange={page => onSearch(page)}
        onRow={record => {
          return {
            onClick: () => handleAddData(record), // 点击行
          };
        }}
      />
    );
  }
}
export default ListTable;
