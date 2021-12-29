/*
 * @Description: 售后在制品盘点成品报表
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
    // expendedKeyList,
    pagination,
    loading,
    handleFetchList,
    // onExpandTable,
  } = props;
  const columns = [
    {
      title: '接收SN',
      dataIndex: 'snNum',
      width: 180,
    },
    {
      title: '当前SN',
      dataIndex: 'materialLotCode',
      width: 180,
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
      dataIndex: 'materialLotCodeStatusMeaning',
      width: 100,
    },
    {
      title: '型号',
      dataIndex: 'materialModel',
      width: 100,
    },
    {
      title: '工单号',
      dataIndex: 'workOrderNum',
      width: 100,
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
      title: '来源SN',
      dataIndex: 'sourceSnNum',
      width: 90,
    },
    {
      title: '半成品数量',
      dataIndex: 'qty',
      width: 130,
    },
    {
      title: '拆机时间',
      dataIndex: 'splitTime',
      width: 180,
    },
    {
      title: '工单结束时间',
      dataIndex: 'actualEndDate',
      width: 180,
    },
    {
      title: '当前状态',
      dataIndex: 'splitStatusMeaning',
      width: 100,
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
      width: 140,
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
      width: 130,
    },
    {
      title: '所在货位名称',
      dataIndex: 'locatorName',
      width: 130,
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
    {
      title: '入库单号',
      dataIndex: 'instructionDocNum',
      width: 100,
    },
    {
      title: '入库单号是否为空',
      dataIndex: 'docNumFlagMeaning',
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
      childrenColumnName='childList'
      // expandedRowKeys={expendedKeyList}
      // onExpand={onExpandTable}
      rowKey={record => {
        let type = record.unfoldFlag ? 'event' : 'request';
        type = `${type}_${record.snNum}`;
        return type;
      }}
    />
  );
};

export default forwardRef(TableList);
