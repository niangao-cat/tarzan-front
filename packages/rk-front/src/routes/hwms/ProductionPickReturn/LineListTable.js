import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { numberRender } from 'utils/renderer';
import intl from 'utils/intl';

class ListTableRow extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

    const { loading, dataSource, pagination, onSearch, onRow } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        width: 100,
        dataIndex: 'instructionLineNum',
        render: (value, record) => {
          return (<a onClick={() => onRow(record)}>{record.instructionLineNum}</a>);
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.materialId`).d('物料'),
        width: 120,
        dataIndex: 'materialId',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('版本'),
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('制单数量'),
        width: 100,
        align: 'center',
        dataIndex: 'quantity',
        render: (value) => {
          // eslint-disable-next-line no-restricted-properties
          return Math.round( value * Math.pow( 10, 3 ) ) / Math.pow( 10, 3 );
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('执行数量'),
        width: 100,
        align: 'center',
        dataIndex: 'actualQty',
        render: (val) => {
          if (val === "" || val === undefined || val === null) {
            return 0;
          } else {
            // eslint-disable-next-line no-restricted-properties
            return Math.round( val * Math.pow( 10, 3 ) ) / Math.pow( 10, 3 );
          }
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.uomId`).d('单位'),
        width: 70,
        dataIndex: 'uomId',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('状态'),
        width: 80,
        dataIndex: 'instructionStatusMeaning',
        // render: val => (statusMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: intl.get(`${commonModelPrompt}.toLocatorId`).d('目标仓库'),
        width: 120,
        dataIndex: 'toLocatorId',
      },
      {
        title: intl.get(`${commonModelPrompt}.sales`).d('销售订单号+行号'),
        width: 160,
        dataIndex: 'soLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.bomReserveLineNum`).d('预留项目号+行号'),
        width: 160,
        dataIndex: 'bomReserveLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdBy`).d('创建人'),
        width: 100,
        dataIndex: 'createdBy',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 160,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('执行人'),
        width: 100,
        dataIndex: 'lastUpdatedBy',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('执行时间'),
        width: 160,
        dataIndex: 'lastUpdateDate',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource.sort((a, b) => a.instructionLineNum - b.instructionLineNum)}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
