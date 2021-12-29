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
import { Bind } from 'lodash-decorators';
import moment from 'moment';
import { getDateFormat } from 'utils/utils';

import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleOpenDrawer(record) {
    const { onOpenDrawer } = this.props;
    if (onOpenDrawer) {
      onOpenDrawer(record);
    }
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { loading, dataSource, onSearch, pagination, dynamicColumns } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 100,
        fixed: 'left',
      },
      {
        title: '工单产品编码',
        dataIndex: 'woMaterialCode',
        width: 100,
        fixed: 'left',
      },
      {
        title: '工单产品描述',
        dataIndex: 'woMaterialName',
        width: 100,
        fixed: 'left',
      },
      {
        title: '序列号',
        dataIndex: 'materialLotCode',
        width: 100,
        fixed: 'left',
      },
      {
        title: 'SN产品编码',
        dataIndex: 'snMaterialCode',
        width: 100,
      },
      {
        title: 'SN产品描述',
        dataIndex: 'snMaterialName',
        width: 100,
      },
      {
        title: '加工时间',
        dataIndex: 'siteInDate',
        width: 120,
      },
      {
        title: '工序',
        dataIndex: 'processName',
        width: 100,
      },
      {
        title: '工位',
        dataIndex: 'workcellName',
        width: 100,
      },
      {
        title: '加工人',
        dataIndex: 'siteInRealName',
        width: 100,
      },
      {
        title: '班次日期',
        dataIndex: 'shiftDate',
        width: 100,
        render: val => moment(val).format(getDateFormat()),
      },
      {
        title: '班次编码',
        dataIndex: 'shiftCode',
        width: 100,
      },
    ];
    const newColumns = columns.concat(dynamicColumns);
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={newColumns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
