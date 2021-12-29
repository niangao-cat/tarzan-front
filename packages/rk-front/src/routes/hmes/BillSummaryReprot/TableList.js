/*
 * @Description: table-list
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:58:32
 * @LastEditTime: 2021-02-26 11:44:48
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
      title: '单据类型',
      dataIndex: 'instructionDocTypeMeaning',
      width: 100,
    },
    {
      title: '单据号',
      dataIndex: 'instructionDocNum',
      width: 100,
    },
    {
      title: '单据状态',
      dataIndex: 'instructionDocStatusMeaning',
      width: 100,
    },
    {
      title: '成本中心',
      dataIndex: 'costcenterCode',
      width: 100,
    },
    {
      title: '成本中心描述',
      dataIndex: 'description',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 90,
    },
    {
      title: '单据行号',
      dataIndex: 'lineNum',
      width: 100,
    },
    {
      title: '行类型',
      dataIndex: 'instructionTypeMeaning',
      width: 100,
    },
    {
      title: '行状态',
      dataIndex: 'instructionStatusMeaning',
      width: 100,
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
      width: 100,
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
      width: 90,
    },
    {
      title: '物料版本',
      dataIndex: 'materialVersion',
      width: 90,
    },
    {
      title: '单位',
      dataIndex: 'uomCode',
      width: 100,
    },
    {
      title: '物料组',
      dataIndex: 'itemGroup',
      width: 100,
    },
    {
      title: '物料组描述',
      dataIndex: 'itemGroupDescription',
      width: 110,
    },
    {
      title: '需求数量',
      dataIndex: 'quantity',
      width: 90,
    },
    {
      title: '执行数量',
      dataIndex: 'actualQuantity',
      width: 90,
    },
    {
      title: '发料仓库',
      dataIndex: 'fromWarehouseCode',
      width: 90,
    },
    {
      title: '发料货位',
      dataIndex: 'fromLocatorCode',
      width: 90,
    },
    {
      title: '收料仓库',
      dataIndex: 'toWarehouseCode',
      width: 90,
    },
    {
      title: '收料货位',
      dataIndex: 'toLocatorCode',
      width: 90,
    },
    {
      title: '超发设置',
      dataIndex: 'excessSettingMeaning',
      width: 90,
    },
    {
      title: '超发值',
      dataIndex: 'excessValue',
      width: 90,
    },
    {
      title: '供应商编码',
      dataIndex: 'supplierCode',
      width: 110,
    },
    {
      title: '供应商描述',
      dataIndex: 'supplierName',
      width: 110,
      align: 'center',
    },
    {
      title: '销单号',
      dataIndex: 'soNum',
      width: 130,
      align: 'center',
    },
    {
      title: '销单行号',
      dataIndex: 'soLine',
      width: 130,
      align: 'center',
    },
    {
      title: '订单类型',
      dataIndex: 'poTypeMeaning',
      width: 90,
      align: 'center',
    },
    {
      title: '制单人',
      dataIndex: 'realName',
      width: 90,
      align: 'center',
    },
    {
      title: '制单时间',
      dataIndex: 'creationDate',
      width: 130,
      align: 'center',
    },
    {
      title: '执行人',
      dataIndex: 'excuteRealName',
      width: 90,
    },
    {
      title: '执行时间',
      dataIndex: 'lastUpdateDate',
      width: 130,
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
