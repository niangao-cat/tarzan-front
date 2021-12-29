import React, { Component } from 'react';
import { Table, Row } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';


export default class StopMidTable extends Component {

  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.chipPreSelection';
    const {
      loading,
      dataSource,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('电流'),
        dataIndex: 'current',
        width: 60,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('数据项'),
        dataIndex: 'collectionItemMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('计算'),
        dataIndex: 'countTypeMeaning',
        width: 60,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('范围'),
        dataIndex: 'rangeTypeMeaning',
        width: 60,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('值'),
        dataIndex: 'ruleValue',
        width: 50,
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <Row>
          <Table
            columns={columns}
            bordered
            pagination={false}
            loading={loading}
            dataSource={dataSource}
            scroll={{ x: tableScrollWidth(columns, 50), y: 100}}
            style={{marginTop: '0.5vw'}}
          />
        </Row>
      </React.Fragment>
    );
  }
}
