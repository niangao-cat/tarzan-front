/*
 * @Description: 行数据
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-11 09:08:34
 * @LastEditTime: 2020-09-15 15:28:50
 */
import React from 'react';
import { Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';

export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { loading, dataSource, pagination, onSearch, handleChangeSelectLineRows, selectedLineRowKeys, headRecord } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedLineRowKeys,
      onChange: handleChangeSelectLineRows,
    };
    const columns = [
      {
        title: '行号',
        width: 80,
        dataIndex: 'lineNum',
      },
      {
        title: '行状态',
        width: 100,
        align: 'center',
        dataIndex: 'lineStatusMeaning',
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料版本',
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: '物料描述',
        width: 400,
        dataIndex: 'materialName',
      },
      {
        title: '入库数',
        width: 80,
        align: 'center',
        dataIndex: 'receiptQty',
      },
      {
        title: '执行数',
        width: 80,
        align: 'center',
        dataIndex: 'executeQty',
      },
      {
        title: '单位',
        width: 80,
        align: 'center',
        dataIndex: 'uom',
      },
      {
        title: '目标仓库',
        width: 120,
        dataIndex: 'targetWarehouse',
      },
      {
        title: '备注',
        width: 170,
        dataIndex: 'remark',
      },
    ];
    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={rowSelection}
        onChange={page => onSearch(page, headRecord)}
        scroll={{ x: tableScrollWidth(columns), y: 180 }}
        loading={loading}
        rowKey="instructionId"
      />
    );
  }
}
