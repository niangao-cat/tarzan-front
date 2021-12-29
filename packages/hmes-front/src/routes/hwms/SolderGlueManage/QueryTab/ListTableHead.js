import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableHead extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.solderGlueManage.model.solderGlueManage';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
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
        title: intl.get(`${modelPrompt}.primaryUomCode`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt2}.inLocatorTime`).d('入库时间'),
        dataIndex: 'inLocatorTime',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'solderGlueStatusMeaning',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.statusStartTime`).d('状态开始时间'),
        dataIndex: 'statusDateTime',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt2}.monitoredRate`).d('状态时长监控'),
        dataIndex: 'monitoredRate',
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
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          fixed: true,
          type: 'radio',
          columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTableHead;
