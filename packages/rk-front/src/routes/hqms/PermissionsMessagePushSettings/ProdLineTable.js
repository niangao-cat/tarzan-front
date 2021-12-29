/*
 * @Description: 生产线table
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 16:55:41
 * @LastEditTime: 2021-03-01 15:30:51
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const ProdLineTable = (props) => {

  const {
    dataSource,
    loading,
    handleFetchLineList,
    pagination,
    selectedHeadRows,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '生产线',
      dataIndex: 'detailObjectCode',
      width: 100,
      align: 'center',
    },
    {
      title: '生产线描述',
      dataIndex: 'detailObjectName',
      width: 110,
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

export default ProdLineTable;