/*
 * @Description: 售后在制品盘点半成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
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
      title: '工单号',
      dataIndex: 'workOrderNum',
      width: 100,
    },
    {
      title: '接收SN',
      dataIndex: 'snNum',
      width: 100,
    },
    {
      title: '当前SN',
      dataIndex: 'materialLotCode',
      width: 100,
    },
    {
      title: '条码有效性',
      dataIndex: 'enableFlagMeaning',
      width: 100,
    },
    {
      title: '在制标识',
      dataIndex: 'mfFlagMeaning',
      width: 100,
    },
    {
      title: '条码状态',
      dataIndex: 'materialLotStatusMeaning',
      width: 100,
    },
    {
      title: '产品编码',
      dataIndex: 'materialCode',
      width: 100,
    },
    {
      title: '产品描述',
      dataIndex: 'materialName',
      width: 120,
    },
    {
      title: '工单状态',
      dataIndex: 'workOrderStatusMeaning',
      width: 100,
    },
    {
      title: '是否创建sn',
      dataIndex: 'isCreateSnMeaning',
      width: 100,
    },
    {
      title: '工单结束时间',
      dataIndex: 'actualEndDate',
      width: 100,
    },
    {
      title: '拆机时间',
      dataIndex: 'splitTime',
      width: 90,
    },
    {
      title: '当前状态',
      dataIndex: 'splitStatusMeaning',
      width: 100,
    },
    {
      title: '当前工位编码',
      dataIndex: 'workcellCode',
      width: 100,
    },
    {
      title: '当前工位描述',
      dataIndex: 'workcellName',
      width: 100,
    },
    {
      title: '所在仓库编码',
      dataIndex: 'warehouseCode',
      width: 100,
    },
    {
      title: '所在仓库名称',
      dataIndex: 'warehouseName',
      width: 90,
    },
    {
      title: '所在货位编码',
      dataIndex: 'locatorCode',
      width: 90,
    },
    {
      title: '所在货位名称',
      dataIndex: 'locatorName',
      width: 100,
    },
    {
      title: '物料组',
      dataIndex: 'itemGroupCode',
      width: 100,
    },
    {
      title: '物料组描述',
      dataIndex: 'itemGroupDescription',
      width: 110,
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
