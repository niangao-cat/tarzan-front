import React, { Component } from 'react';
import { Table, Row } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';


export default class StopMidTable extends Component {

  // 更改颜色
  handleClickRow(record) {
    if ( record.isTrue === "Y") {
      return styles['data-click-chip'];
    } else {
      return '';
    }
  }

  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.chipPreSelection';
    const {
      loading,
      dataSource,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('序号'),
        dataIndex: 'a',
        width: 60,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.position`).d('虚拟号'),
        dataIndex: 'virtualNum',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('旧盒子'),
        dataIndex: 'materialLotCode',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.displayOldLoad`).d('旧盒位置'),
        dataIndex: 'displayOldLoad',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.displayNewLoad`).d('新盒位置'),
        dataIndex: 'displayNewLoad',
        width: 80,
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
            scroll={{ x: tableScrollWidth(columns, 50) }}
            style={{marginTop: '0.5vw'}}
            rowClassName={this.handleClickRow}
          />
        </Row>
      </React.Fragment>
    );
  }
}
