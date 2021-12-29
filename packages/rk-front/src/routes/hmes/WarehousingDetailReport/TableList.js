/*
 * @Description: table-list
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:58:32
 * @LastEditTime: 2021-03-10 09:34:20
 */
import React, { forwardRef } from 'react';
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
      title: '站点',
      dataIndex: 'siteCode',
      width: 100,
    },
    {
      title: '制造部',
      dataIndex: 'attrValue',
      width: 100,
    },
    {
      title: '工单编号',
      dataIndex: 'workOrderNum',
      width: 130,
    },
    {
      title: '工单版本',
      dataIndex: 'productionVersion',
      width: 100,
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      width: 120,
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      width: 90,
    },
    {
      title: '工单类型',
      dataIndex: 'workOrderType',
      width: 100,
    },
    {
      title: '工单状态',
      dataIndex: 'workOrderStatus',
      width: 100,
    },
    {
      title: '生产线',
      dataIndex: 'prodLineName',
      width: 100,
    },
    {
      title: '工单数量',
      dataIndex: 'qty',
      width: 100,
    },
    {
      title: '已入库数量',
      dataIndex: 'actualQtySum',
      width: 100,
    },
    {
      title: '入库率',
      dataIndex: 'rate',
      width: 90,
    },
    {
      title: '序列号',
      dataIndex: 'materialLotCode',
      width: 130,
    },
    {
      title: '入库时间',
      dataIndex: 'creationDate',
      width: 130,
    },
    {
      title: '入库容器',
      dataIndex: 'containerCode',
      width: 130,
    },
    {
      title: '库存地点',
      dataIndex: 'locatorCode',
      width: 90,
    },
    {
      title: '作业人',
      dataIndex: 'realName',
      width: 90,
    },
    {
      title: '单据号',
      dataIndex: 'instructionDocNum',
      width: 130,
    },
    {
      title: '单据状态',
      dataIndex: 'instructionDocStatusMeaning',
      width: 90,
    },
  ];
  return (
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={page => handleFetchList(page)}
      rowKey="ssnInspectResultHeaderId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default forwardRef(TableList);
