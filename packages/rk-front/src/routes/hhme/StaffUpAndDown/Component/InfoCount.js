/*
 * @Description: 信息统计
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-28 16:00:44
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-28 16:45:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Card, Table } from 'hzero-ui';

export default class ProcessAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const{ listData, pagination, handleTableChange } = this.props;
    const columns = [
      {
        title: '班次',
        dataIndex: 'shiftCode',
        width: 120,
      },
      {
        title: '员工',
        dataIndex: 'employeeName',
        width: 120,
      },
      {
        title: '工段',
        dataIndex: 'workcellName',
        width: 120,
      },
      {
        title: '生产线',
        dataIndex: 'prodLineName',
        width: 120,
      },
      {
        title: '车间',
        dataIndex: 'areaName',
        width: 120,
      },
      {
        title: '工厂',
        dataIndex: 'siteName',
        width: 120,
      },
      {
        title: '事项',
        dataIndex: 'operation',
        width: 120,
      },
      {
        title: '离岗原因',
        dataIndex: 'reason',
        width: 120,
      },
      {
        title: '时间',
        dataIndex: 'operationDate',
        width: 150,
      },
      {
        title: '当班累计时长',
        dataIndex: 'duration',
        width: 120,
      },
    ];
    return (
      <Card
        title="信息统计"
      >
        <Table
          columns={columns}
          dataSource={listData}
          pagination={pagination || {}}
          onChange={handleTableChange}
          scroll={{ y: 167 }}
        />
      </Card>
    );
  }
}
