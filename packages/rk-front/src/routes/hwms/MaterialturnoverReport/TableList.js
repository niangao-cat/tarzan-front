/*
 * @Description: table-list
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 17:44:36
 * @LastEditTime: 2021-02-03 10:02:47
 */
import React from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const TableList = (props) => {

  const {
    dataSource,
    pagination,
    loading,
    handleFetchList,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      width: 110,
      align: 'center',
      render: (text, data, index) => {
        return index + 1;
      },
    },
    {
      title: '工厂',
      dataIndex: 'siteCode',
      width: 110,
      align: 'center',
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      width: 110,
      align: 'center',
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      width: 110,
      align: 'center',
    },
    {
      title: '仓库',
      dataIndex: 'warehouseCode',
      width: 110,
      align: 'center',
    },
    {
      title: '货位',
      dataIndex: 'locatorCode',
      width: 110,
      align: 'center',
    },
    {
      title: '期初库存',
      dataIndex: 'startInventory',
      width: 110,
      align: 'center',
    },
    {
      title: '总收货数量',
      dataIndex: 'receiptQty',
      width: 110,
      align: 'center',
    },
    {
      title: '总发货数量',
      dataIndex: 'sendQty',
      width: 110,
      align: 'center',
    },
    {
      title: '期末库存',
      dataIndex: 'endInventory',
      width: 110,
      align: 'center',
    },
    {
      title: '周转率',
      dataIndex: 'turnoverRate',
      width: 110,
      align: 'center',
    },
    {
      title: '计量单位',
      dataIndex: 'uomCode',
      width: 110,
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      width: 110,
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
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
      rowKey="materialLotId"
      loading={loading}
      onChange={page => handleFetchList(page)}
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default TableList;
