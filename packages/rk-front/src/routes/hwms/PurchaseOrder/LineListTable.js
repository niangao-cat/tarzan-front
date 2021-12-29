import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hmes.purchaseOrder';
    const { loading, dataSource, onSearch, rowSelection, codeMap, lineDetail, selectedHead, pagination } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        width: 80,
        dataIndex: 'instructionLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料号'),
        width: 100,
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('采购订单数量'),
        width: 110,
        align: 'center',
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.poLineTypeMeaning`).d('订单类型'),
        width: 110,
        align: 'center',
        dataIndex: 'poLineTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('行状态'),
        width: 80,
        dataIndex: 'instructionStatus',
        align: 'center',

        render: val => (codeMap.filter(ele => ele.value === val)[0] || {}).meaning,
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('预计到货时间'),
        width: 160,
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorName`).d('接收仓库'),
        width: 150,
        dataIndex: 'locatorName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receivedQty`).d('已接收数量'),
        width: 110,
        align: 'center',
        dataIndex: 'receivedQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.coverQty`).d('已制单数量'),
        width: 110,
        align: 'center',
        dataIndex: 'quantityOrdered',
      },
      {
        title: intl.get(`${commonModelPrompt}.availableOrderQuantity`).d('可制单数量'),
        dataIndex: 'availableOrderQuantity',
        align: 'center',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.soNumsoLineNum`).d('销售订单号-行号'),
        dataIndex: 'soNumsoLineNum',
        align: 'center',
        width: 150,
        render: (val, record) => {
          return <span>{record.soNum}-{record.soLineNum}</span>;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        width: 80,
        dataIndex: 'primaryUomCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.sampleFlag`).d('样品标示'),
        width: 80,
        dataIndex: 'sampleFlag',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
        width: 200,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        fixed: 'right',
        align: 'center',
        render: (val, record) => selectedHead.length > 0 ? selectedHead[0].instructionDocType !== "PO" ?
          (
            <span className="action-link">
              <a onClick={() => lineDetail(record, true)}>组件明细</a>
            </span>
          ) :
          (
            <span style={{ color: 'gray' }}>
              组件明细
            </span>
          ) : (
            <span style={{ color: 'gray' }}>
              组件明细
            </span>
          ),
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
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}

export default ListTableRow;
