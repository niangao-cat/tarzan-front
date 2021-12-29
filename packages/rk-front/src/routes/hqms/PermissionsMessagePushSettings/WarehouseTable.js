/*
 * @Description: 仓库table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:54:35
 * @LastEditTime: 2021-03-01 15:32:44
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const WarehouseTable = (props) => {

  const {
    dataSource,
    loading,
    handleFetchLineList,
    selectedHeadRows,
    pagination,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '仓库',
      dataIndex: 'detailObjectCode',
      width: 100,
      align: 'center',
    },
    {
      title: '仓库描述',
      dataIndex: 'detailObjectName',
      width: 100,
      align: 'center',
    },
  ];
  return (
    <Table
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
      onChange={page => handleFetchLineList(selectedHeadRows, page)}
      rowKey="detailId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default WarehouseTable;
