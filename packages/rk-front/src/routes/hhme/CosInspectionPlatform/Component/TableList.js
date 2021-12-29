import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import {
  tableScrollWidth,
} from 'utils/utils';
import styles from '../index.less';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
export default class TableList extends Component {

  @Bind()
  handleClickSelectedRows(record) {
    const { queryLoadData } = this.props;
    return {
      onClick: () => {
        queryLoadData(record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { woRecord = {} } = this.props;
    if (woRecord.eoJobSnId === record.eoJobSnId) {
      return styles['cos-inspection-click'];
    } else {
      return '';
    }
  }

  render() {
    const { dataSource, loading } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 80,
      },
      {
        title: '盒子编号',
        dataIndex: 'materialLotCode',
        width: 115,
      },
      {
        title: 'Cos数量',
        dataIndex: 'primaryUomQty',
        width: 90,
      },
      {
        title: 'wafer',
        dataIndex: 'wafer',
        width: 90,
      },
      {
        title: '来料批次',
        dataIndex: 'lotNo',
        width: 90,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 90,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 90,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 90,
      },
      {
        title: '进站时间',
        dataIndex: 'siteInDate',
        width: 125,
      },
      {
        title: '出站时间',
        dataIndex: 'siteOutDate',
        width: 125,
      },
    ];
    return (
      <Table
        bordered
        rowKey="eoJobSnId"
        columns={columns}
        loading={loading}
        dataSource={isEmpty(dataSource) ? [] : dataSource}
        // scroll={{ x: tableScrollWidth(columns) }}
        pagination={false}
        scroll={{ x: tableScrollWidth(columns), y: 190 }}
        onRow={this.handleClickSelectedRows}
        rowClassName={record => this.handleClickRow(record)}
      />
    );
  }
}
