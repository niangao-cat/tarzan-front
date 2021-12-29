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
      rowsSelection,
      changeBackColor,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.name`).d('序号'),
        dataIndex: 'a',
        align: 'center',
        width: 60,
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.virtualNum`).d('虚拟号'),
        dataIndex: 'virtualNum',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.preSelectionLot`).d('挑选批次'),
        dataIndex: 'preSelectionLot',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.isTrue`).d('状态'),
        dataIndex: 'isTrue',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode`).d('旧盒'),
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
        title: intl.get(`${commonModelPrompt}.materialCode`).d('芯片料号'),
        dataIndex: 'materialCode',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.displayNewLoad`).d('新盒位置'),
        dataIndex: 'displayNewLoad',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.cosType`).d('芯片类型'),
        dataIndex: 'cosType',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.loadSequence`).d('序列号'),
        dataIndex: 'loadSequence',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rule1`).d('规则一'),
        dataIndex: 'rule1',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rule2`).d('规则二'),
        dataIndex: 'rule2',
        width: 80,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.rule3`).d('规则三'),
        dataIndex: 'rule3',
        width: 100,
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
            rowKey="selectionDetailsId"
            scroll={{ x: tableScrollWidth(columns, 50) }}
            style={{marginTop: '0.5vw'}}
            rowClassName={changeBackColor}
            rowSelection={rowsSelection}
          />
        </Row>
      </React.Fragment>
    );
  }
}
