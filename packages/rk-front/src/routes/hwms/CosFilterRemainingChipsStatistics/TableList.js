/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS筛选剩余芯片统计报表
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const commonModelPrompt = 'tarzan.hwms.cosFilterRemainingChipsStatistics';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionLot`).d('筛选批次'),
        dataIndex: 'preSelectionLot',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deviceMaterialCode`).d('器件物料编码'),
        dataIndex: 'deviceMaterialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deviceMaterialName`).d('器件物料描述'),
        dataIndex: 'deviceMaterialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preRuleCode`).d('筛选规则编码'),
        dataIndex: 'preRuleCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('cos类型'),
        dataIndex: 'cosType',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionCount`).d('筛选批次总数'),
        dataIndex: 'preSelectionCount',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosCount`).d('该盒COS总数'),
        dataIndex: 'cosCount',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.noPreCount`).d('该盒未挑选数'),
        dataIndex: 'noPreCount',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('条码数量'),
        dataIndex: 'primaryUomQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.userName`).d('操作人'),
        dataIndex: 'userName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preparationDate`).d('筛选时间'),
        dataIndex: 'preparationDate',
        width: '100',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
