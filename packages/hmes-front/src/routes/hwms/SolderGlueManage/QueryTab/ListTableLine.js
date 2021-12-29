import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.solderGlueManage.model.solderGlueManage';
    const { loading, dataSource } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('瓶码'),
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'solderGlueStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.startDateTime`).d('开始时间'),
        dataIndex: 'statusDateTime',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt2}.endDateTime`).d('结束时间'),
        dataIndex: 'statusEndDateTime',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt2}.recipientsCounts`).d('冷藏次数'),
        dataIndex: 'recipientsCounts',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.recipientsProdLine`).d('领用产线'),
        dataIndex: 'recipientsProdLine',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.returnOutTime `).d('归还是否超时'),
        dataIndex: 'returnOutTime',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.returnEmptyBottle`).d('空瓶是否归还'),
        dataIndex: 'returnEmptyBottle',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.operator`).d('操作人'),
        dataIndex: 'operator',
        width: 150,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        scroll={{ x: tableScrollWidth(columns), y: 200 }}
      />
    );
  }
}

export default ListTableLine;
