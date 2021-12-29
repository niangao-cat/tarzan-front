import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt2}.sequence`).d('序列号'),
        width: 120,
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPromt2}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPromt2}.materialLotQty`).d('数量'),
        dataIndex: 'qty',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
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
        title: intl.get(`${modelPromt2}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotCode"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
      />
    );
  }
}

export default ListTableLine;
