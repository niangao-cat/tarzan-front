import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

export default class UnusualTable extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.equipmentMonitoringBoard';

    // 模拟数据
    const demo = [
        {name: 'B-28改', position: '工位-1', doTime: 8790, stopTime: 988000},
        {name: 'B-29改', position: '工位-2', doTime: 8791, stopTime: 988001},
        {name: 'B-30改', position: '工位-3', doTime: 8792, stopTime: 988002},
        {name: 'B-31改', position: '工位-4', doTime: 8793, stopTime: 988003},
        {name: 'B-32改', position: '工位-5', doTime: 8794, stopTime: 988004},
        {name: 'B-33改', position: '工位-6', doTime: 8795, stopTime: 988005},
        {name: 'B-34改', position: '工位-7', doTime: 8796, stopTime: 988006},
        {name: 'B-35改', position: '工位-8', doTime: 8797, stopTime: 988007},
        {name: 'B-36改', position: '工位-9', doTime: 8798, stopTime: 988008},
        {name: 'B-37改', position: '工位-10', doTime: 8799, stopTime: 988009},
    ];
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('名称'),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('位置'),
        dataIndex: 'position',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('处理时长'),
        dataIndex: 'doTime',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('停机时长'),
        dataIndex: 'stopTime',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        pagination={false}
        dataSource={demo}
        columns={columns}
      />
    );
  }
}
