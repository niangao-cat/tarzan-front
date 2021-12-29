/*
 * @Description: 行
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 15:25:08
 * @LastEditTime: 2021-02-04 15:35:35
 */

import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const LineTable = (props) => {

  const {
    dataSource,
    pagination,
    loading,
    handleFetchLineList,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequence',
      width: 70,
      align: 'center',
    },
    {
      title: '检验项编码',
      dataIndex: 'tagCode',
      width: 110,
      align: 'center',
    },
    {
      title: '检验项描述',
      dataIndex: 'tagDescription',
      width: 110,
      align: 'center',
    },
    {
      title: '最小值',
      dataIndex: 'minimumValue',
      width: 100,
      align: 'center',
    },
    {
      title: '最大值',
      dataIndex: 'maximalValue',
      width: 100,
      align: 'center',
    },
    {
      title: '检验值',
      dataIndex: 'inspectValue',
      width: 100,
      align: 'center',
    },
    {
      title: '检验结果',
      dataIndex: 'result',
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
      onChange={page => handleFetchLineList(page)}
      rowKey="materialLotId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default LineTable;
