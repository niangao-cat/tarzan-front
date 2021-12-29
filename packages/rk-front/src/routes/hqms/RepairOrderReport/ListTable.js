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
        title: '产品编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '产品描述',
        width: 80,
        dataIndex: 'materialName',
      },
      {
        title: '型号',
        width: 80,
        dataIndex: 'model',
      },
      {
        title: '登记时间',
        width: 120,
        dataIndex: 'receiveDate',
      },
      {
        title: '返回类型',
        width: 120,
        dataIndex: 'backTypeMeaning',
      },
      {
        title: 'SAP信息返回时间',
        width: 120,
        dataIndex: 'sapReturnDate',
      },
      {
        title: '维修订单号',
        dataIndex: 'repairWorkOrderNum',
        width: 120,
      },
      {
        title: '维修订单类型',
        width: 90,
        dataIndex: 'internalOrderTypeMeaning',
      },
      {
        title: 'SAP创建时间',
        width: 100,
        dataIndex: 'sapCreationDate',
      },
      {
        title: 'MES接收时间',
        width: 100,
        align: 'center',
        dataIndex: 'mesReceiveDate',
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
