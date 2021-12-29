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
      rowClick,
      changeBackColor,
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
        title: intl.get(`${commonModelPrompt}.position`).d('原盒子号'),
        dataIndex: 'materialLotCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.doTime`).d('库位'),
        dataIndex: 'locatorCode',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.stopTime`).d('数量'),
        dataIndex: 'num',
        width: 60,
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
            scroll={{ x: tableScrollWidth(columns, 50), y: 260 }}
            style={{ marginTop: '0.5vw' }}
            onRow={record => {
              return {
                onClick: () => {
                  rowClick(record);
                },
              };
            }}
            rowClassName={changeBackColor}
          />
        </Row>
      </React.Fragment>
    );
  }
}
