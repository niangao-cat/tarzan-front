import React, { Component } from 'react';
import { Table, Row } from 'hzero-ui';
import intl from 'utils/intl';


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
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('数据项'),
        dataIndex: 'collectionItemMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('计算'),
        dataIndex: 'countTypeMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('范围'),
        dataIndex: 'rangeTypeMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('值'),
        dataIndex: 'ruleValue',
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
            style={{marginTop: '0.5vw'}}
          />
        </Row>
      </React.Fragment>
    );
  }
}
