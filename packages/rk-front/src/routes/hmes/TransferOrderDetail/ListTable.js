/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-30 14:06:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-08-04 08:12:12
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { loading, dataSource, onSearch, pagination } = this.props;
    const columns = [
      {
        title: '调拨单',
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: '调拨单状态',
        dataIndex: 'instructionDocStatusMeaning',
        width: 120,
      },
      {
        title: '工厂',
        dataIndex: 'siteCode',
        width: 120,
      },
      {
        title: '调拨单类型',
        dataIndex: 'instructionDocTypeMeaning',
        width: 120,
      },
      {
        title: '制单人',
        dataIndex: 'createdByName',
        width: 120,
      },
      {
        title: '制单时间',
        dataIndex: 'creationDate',
        width: 120,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: '行号',
        dataIndex: 'instructionLineNum',
        width: 120,
      },
      {
        title: '物料',
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 120,
      },
      {
        title: '制单数量',
        dataIndex: 'quantity',
        width: 120,
      },
      {
        title: '待调拨数量',
        dataIndex: 'waitAllocationQty',
        width: 120,
      },
      {
        title: '已签收数量',
        dataIndex: 'actualQuantity',
        width: 120,
      },
      {
        title: '行状态',
        dataIndex: 'instructionStatusMeaning',
        width: 120,
      },
      {
        title: '签收条码号',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '条码物料版本',
        dataIndex: 'detailMaterialVersion',
        width: 120,
      },
      {
        title: '物料批次',
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: '供应商批次',
        dataIndex: 'supplierLot',
        width: 120,
      },
      {
        title: '容器编码',
        dataIndex: 'containerCode',
        width: 120,
      },
      {
        title: '调拨数量',
        dataIndex: 'allocationQty',
        width: 120,
      },
      {
        title: '调拨操作人',
        dataIndex: 'allocationUser',
        width: 120,
      },
      {
        title: '调拨时间',
        dataIndex: 'allocationDate',
        width: 120,
      },
      {
        title: '来源仓库',
        dataIndex: 'fromWarehouseCode',
        width: 120,
      },
      {
        title: '来源货位',
        dataIndex: 'fromLocatorCode',
        width: 120,
      },
      {
        title: '目标仓库',
        dataIndex: 'toWarehouseCode',
        width: 120,
      },
      {
        title: '目标货位',
        dataIndex: 'toLocatorCode',
        width: 120,
      },
      {
        title: '最新执行人',
        dataIndex: 'executorUser',
        width: 120,
      },
      {
        title: '最新执行时间',
        dataIndex: 'executorDate',
        width: 120,
      },
      {
        title: '超发设置',
        dataIndex: 'excessSettingMeaning',
        width: 120,
      },
      {
        title: '超发值',
        dataIndex: 'excessValue',
        width: 120,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
