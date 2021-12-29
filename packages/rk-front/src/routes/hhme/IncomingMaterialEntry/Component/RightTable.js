/*
 * @Description: 班组工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-09 17:56:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-25 09:29:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class RightTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  HandoverMatterForm;

  componentDidMount() {

  }

  render() {
    const columns = [
      {
        title: '物料条码',
        dataIndex: 'materialLotCode',
        width: 70,
      },
      {
        title: '组件编码',
        dataIndex: 'materialCode',
        width: 70,
      },
      {
        title: '类型编码',
        dataIndex: 'cosType',
        width: 70,
      },
      {
        title: '已入数量',
        dataIndex: 'worker',
        width: 70,
      },
      {
        title: '来料批次',
        dataIndex: 'jobBatch',
        width: 70,
      },
    ];
    const {
      dataSource,
      onSearch,
    } = this.props;
    return (
      <Table
        bordered
        rowKey="letterId"
        columns={columns}
        pagination={false}
        // loading={fetchLoading}
        dataSource={dataSource}
        scroll={{ y: 190 }}
        // pagination={pagination}
        onChange={page => onSearch(page)}
        // onRow={record => {
        //   return {
        //     onClick: () => handleEditLine(record, true), // 点击行
        //   };
        // }}
      />
    );
  }
}
