import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableHead extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.chargingReturning.model.chargingReturning';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt2}.sequence`).d('序列号'),
        width: 120,
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPromt2}.materialCode`).d('物料号'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPromt2}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.refundQty`).d('应退数量'),
        dataIndex: 'quantity',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.actQty`).d('实退数量'),
        dataIndex: 'actualQuantity',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.difference`).d('差额'),
        dataIndex: 'difference',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.wastageRate`).d('损耗率'),
        dataIndex: 'wastageRate',
        width: 150,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey=""
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns), y: 190 }}
      />
    );
  }
}
export default ListTableHead;
