/*
 * @Description: 自制件返修统计报表
 * @Version: 0.0.1
 * @Author: xin.t@raycuslaser.com
 * @Date: 2021-07-6
 */
import React, { forwardRef } from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const TableList = (props) => {

  const {
    dataSource,
    materialLotCodeStatusList,
    pagination,
    loading,
    handleFetchList,
  } = props;
  const columns = [
    {
      title: '返修SN',
      dataIndex: 'repairSnNum',
      width: 150,
    },
    {
      title: 'EO标识',
      dataIndex: 'identification',
      width: 150,
    },
    {
      title: '型号',
      dataIndex: 'materialModel',
      width: 100,
    },
    {
      title: '产品编码',
      dataIndex: 'materialCode',
      width: 90,
    },
    {
      title: '产品描述',
      dataIndex: 'materialName',
      width: 250,
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
      dataIndex: 'materialLotCodeStatus',
      width: 90,
      render: (val) =>
         (
          (materialLotCodeStatusList.filter(ele => ele.value === val)[0] || {}).meaning
        ),
    },
    {
      title: '工单号',
      dataIndex: 'workOrderNum',
      width: 90,
    },
    {
      title: '工单状态',
      dataIndex: 'wordOrderStatusMeaning',
      width: 100,
    },
    {
      title: '是否创建sn',
      dataIndex: 'createSnFlagMeaning',
      width: 100,
    },
    {
      title: '工单创建时间',
      dataIndex: 'actualStartDate',
      width: 150,
    },
    {
      title: '工单结束时间',
      dataIndex: 'actualEndDate',
      width: 150,
    },
    {
      title: '当前工位编码',
      dataIndex: 'workcellCode',
      width: 140,
    },
    {
      title: '当前工位描述',
      dataIndex: 'workcellName',
      width: 140,
    },
    {
      title: '所在仓库编码',
      dataIndex: 'warehouseCode',
      width: 120,
    },
    {
      title: '所在仓库名称',
      dataIndex: 'warehouseName',
      width: 130,
    },
    {
      title: '所在仓库类型',
      dataIndex: 'warehouseTypeMeaning',
      width: 130,
    },
    {
      title: '所在货位编码',
      dataIndex: 'locatorCode',
      width: 110,
    },
    {
      title: '所在货位名称',
      dataIndex: 'locatorName',
      width: 130,
    },
    {
      title: '事业部',
      dataIndex: 'areaName',
      width: 150,
    },
    {
      title: '申请人工号',
      dataIndex: 'createdId',
      width: 120,
    },
    {
      title: '申请人名称',
      dataIndex: 'createdName',
      width: 100,
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
      scroll={{ x: tableScrollWidth(columns, 50) }}
    />
  );
};

export default forwardRef(TableList);
