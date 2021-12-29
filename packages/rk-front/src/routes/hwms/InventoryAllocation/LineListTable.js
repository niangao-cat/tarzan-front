import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

    const { statusMap, loading, dataSource, pagination, onSearch, onRow } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        width: 70,
        dataIndex: 'instructionLineNum',
        render: (value, record)=>{
          return (<a onClick={() => onRow(record)}>{record.instructionLineNum}</a>);
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        width: 70,
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('调拨数量'),
        width: 80,
        align: 'center',
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.receivedQty`).d('执行数量'),
        width: 80,
        align: 'center',
        dataIndex: 'executeQty',
        render: (val)=>{
          if(val===""||val===undefined||val===null){
            return 0;
          }else{
            return val;
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('状态'),
        width: 80,
        dataIndex: 'instructionStatus',
        render: val => (statusMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: intl.get(`${commonModelPrompt}.excessSettingMeaning`).d('超发设置'),
        dataIndex: 'excessSettingMeaning',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('超发值'),
        dataIndex: 'excessValue',
        width: 70,
      },
      {
        title: intl.get(`${commonModelPrompt}.fromWarehouseCode`).d('来源仓库'),
        width: 120,
        dataIndex: 'fromWarehouseCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.fromLocatorCode`).d('来源货位'),
        width: 120,
        dataIndex: 'fromLocatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.toWarehouseCode`).d('目标仓库'),
        width: 120,
        dataIndex: 'toWarehouseCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorCode`).d('目标货位'),
        width: 120,
        dataIndex: 'toLocatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.fromSiteCode`).d('工厂'),
        width: 100,
        dataIndex: 'fromSiteCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedByName`).d('执行人'),
        width: 100,
        dataIndex: 'lastUpdatedByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('执行时间'),
        width: 160,
        dataIndex: 'lastUpdateDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 150,
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 250 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
