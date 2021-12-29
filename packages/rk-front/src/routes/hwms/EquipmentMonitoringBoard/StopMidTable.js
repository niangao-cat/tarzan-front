import React, { Component } from 'react';
import { Table, Row } from 'hzero-ui';
import intl from 'utils/intl';
import secondTitleImg from '@/assets/JXblue.png';

export default class StopMidTable extends Component {

  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.equipmentMonitoringBoard';

    // 模拟数据
    const demo = [
        {name: 'B-28改', position: '工位-1', doTime: 8790, stopTime: 988000},
        {name: 'B-29改', position: '工位-2', doTime: 8791, stopTime: 988001},
        {name: 'B-30改', position: '工位-3', doTime: 8792, stopTime: 988002},
        {name: 'B-28改', position: '工位-1', doTime: 8790, stopTime: 988000},
        {name: 'B-29改', position: '工位-2', doTime: 8791, stopTime: 988001},
        {name: 'B-29改', position: '工位-2', doTime: 8791, stopTime: 988001},
    ];
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('日期'),
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('原因'),
        dataIndex: 'position',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('时长'),
        dataIndex: 'doTime',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('处理人'),
        dataIndex: 'stopTime',
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <Row>
          <div>
            <img src={secondTitleImg} alt="" style={{ marginTop: '-3PX', marginRight: '5px' }} />
            <span style={{ fontSize: '1vw', fontWeight: 'bold', color: 'rgba(51,51,51,1)' }}>30天内异常处理</span>
          </div>
          <Table
            columns={columns}
            bordered
            pagination={false}
            dataSource={demo}
            style={{marginTop: '0.5vw'}}
          />
        </Row>
      </React.Fragment>
    );
  }
}
