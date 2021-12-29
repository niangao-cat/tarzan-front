/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS员工产量汇总报表
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
    const commonModelPrompt = 'tarzan.hwms.cosEmployeeOutputSummaryReport';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.realName`).d('员工'),
        dataIndex: 'realName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loginName`).d('工号'),
        dataIndex: 'loginName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('产线'),
        dataIndex: 'prodLineName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lineWordcellName`).d('工段'),
        dataIndex: 'lineWordcellName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.processName`).d('工序'),
        dataIndex: 'processName',
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
        title: intl.get(`${commonModelPrompt}.productionVersion`).d('物料版本'),
        dataIndex: 'productionVersion',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
        dataIndex: 'cosType',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.totalSnQty`).d('实际产出'),
        dataIndex: 'totalSnQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ncQty`).d('不良数'),
        dataIndex: 'ncQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.passRate`).d('一次合格率'),
        dataIndex: 'passRate',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.duration`).d('生成总时长'),
        dataIndex: 'duration',
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
