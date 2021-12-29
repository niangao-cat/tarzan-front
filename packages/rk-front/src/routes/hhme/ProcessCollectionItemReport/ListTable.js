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
    if(onOpenDrawer) {
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
        dataIndex: 'identification',
        width: 100,
        fixed: 'left',
      },
      {
        title: 'SN产品编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: 'SN产品描述',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '加工时间',
        dataIndex: 'workTime',
        width: 120,
      },
      {
        title: '工序',
        dataIndex: 'processWorkcellName',
        width: 100,
      },
      {
        title: '工位',
        dataIndex: 'workcellName',
        width: 100,
      },
      {
        title: '质量状态',
        dataIndex: 'qualityStatusMeaning',
        width: 100,
      },
      {
        title: 'EO状态',
        dataIndex: 'eoStatusMeaning',
        width: 100,
      },
      {
        title: '是否冻结',
        dataIndex: 'freezeFlagMeaning',
        width: 100,
      },
      {
        title: '是否转型',
        dataIndex: 'transformFlagMeaning',
        width: 100,
      },
      {
        title: '工位最新不良代码',
        dataIndex: 'latestNcTag',
        width: 100,
      },
      {
        title: '不良发起时间',
        dataIndex: 'ncDate',
        width: 100,
      },
      {
        title: '加工人',
        dataIndex: 'worker',
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
      {
        title: '投料明细',
        dataIndex: 'jobId',
        width: 100,
        render: (val) => <a onClick={() => this.handleOpenDrawer(val)}>投料明细</a>,
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
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
