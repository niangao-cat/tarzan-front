/*
 * @Description: 头
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:30:32
 * @LastEditTime: 2021-02-25 17:39:48
 */
import React, { forwardRef } from 'react';
import { tableScrollWidth } from 'utils/utils';
import { Table } from 'hzero-ui';

const HeadTable = (props) => {

  const {
    dataSource,
    pagination,
    loading,
    handleFetchHeadList,
    selectedHeadRowKeys,
    onSelectHead,
  } = props;
  const columns = [
    {
      title: '序号',
      dataIndex: 'sequenceNum',
      width: 80,
      align: 'center',
    },
    {
      title: '工厂',
      dataIndex: 'siteCode',
      width: 100,
      align: 'center',
    },
    {
      title: '冻结单据',
      dataIndex: 'freezeDocNum',
      width: 110,
      align: 'center',
    },
    {
      title: '冻结类型',
      dataIndex: 'freezeTypeMeaning',
      width: 100,
      align: 'center',
    },
    {
      title: '冻结状态',
      dataIndex: 'freezeDocStatusMeaning',
      width: 100,
      align: 'center',
    },
    {
      title: '审核结果',
      dataIndex: 'approvalStatusMeaning',
      width: 100,
      align: 'center',
    },
    {
      title: '物料',
      dataIndex: 'materialCode',
      width: 100,
      align: 'center',
    },
    {
      title: '物料描述',
      dataIndex: 'materialName',
      width: 100,
      align: 'center',
    },
    {
      title: '物料版本',
      dataIndex: 'materialVersion',
      width: 100,
      align: 'center',
    },
    {
      title: '生产版本',
      dataIndex: 'productionVersion',
      width: 100,
      align: 'center',
    },
    {
      title: '仓库',
      dataIndex: 'warehouseCode',
      width: 90,
      align: 'center',
    },
    {
      title: '货位',
      dataIndex: 'locatorCode',
      width: 90,
      align: 'center',
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      width: 100,
      align: 'center',
    },
    {
      title: '供应商描述',
      dataIndex: 'ressupplierNameult',
      width: 110,
      align: 'center',
    },
    {
      title: '库存批次',
      dataIndex: 'inventoryLot',
      width: 100,
      align: 'center',
    },
    {
      title: '供应商批次',
      dataIndex: 'supplierLot',
      width: 110,
      align: 'center',
    },
    {
      title: '工单',
      dataIndex: 'workOrderNum',
      width: 90,
      align: 'center',
    },
    {
      title: '实验代码',
      dataIndex: 'testCode',
      width: 100,
      align: 'center',
    },
    {
      title: '设备',
      dataIndex: 'equipmentCode',
      width: 90,
      align: 'center',
    },
    {
      title: '生产线',
      dataIndex: 'prodLineCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工段',
      dataIndex: 'workcellCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工序',
      dataIndex: 'processCode',
      width: 90,
      align: 'center',
    },
    {
      title: '工位',
      dataIndex: 'stationCode',
      width: 90,
      align: 'center',
    },
    {
      title: 'COS类型',
      dataIndex: 'cosTypeMeaning',
      width: 90,
      align: 'center',
    },
    {
      title: 'WAFER',
      dataIndex: 'wafer',
      width: 90,
      align: 'center',
    },
    {
      title: '虚拟号',
      dataIndex: 'virtualNum',
      width: 90,
      align: 'center',
    },
    {
      title: '金锡比',
      dataIndex: 'ausnRatio',
      width: 90,
      align: 'center',
    },
    {
      title: '筛选规则',
      dataIndex: 'cosRuleCode',
      width: 90,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'operatedByName',
      width: 90,
      align: 'center',
    },
    {
      title: '班次',
      dataIndex: 'shiftCode',
      width: 90,
      align: 'center',
    },
    {
      title: '生产时间从',
      dataIndex: 'productionDateFrom',
      width: 130,
      align: 'center',
    },
    {
      title: '生产时间至',
      dataIndex: 'productionDateTo',
      width: 130,
      align: 'center',
    },
    {
      title: '热沉编码',
      dataIndex: 'hotSinkNum',
      width: 90,
      align: 'center',
    },
  ];
  return (
    <Table
      bordered
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={page => handleFetchHeadList(page)}
      rowKey="freezeDocId"
      scroll={{ x: tableScrollWidth(columns, 50) }}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: selectedHeadRowKeys,
        onChange: onSelectHead,
      }}
    />
  );
};

export default forwardRef(HeadTable);
