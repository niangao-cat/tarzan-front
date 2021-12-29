/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const { loading, dataSource, pagination, onSearch, barcodeCreate } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('行号'),
        width: 70,
        dataIndex: 'instructionLineNum',
        align: 'center',
      },
      {
        title: '物料编码',
        width: 90,
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
        align: 'center',
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 90,
        align: 'center',
      },
      {
        title: '制单数量',
        dataIndex: 'quantity',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomName`).d('单位'),
        width: 60,
        dataIndex: 'uomName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionStatus`).d('状态'),
        width: 80,
        align: 'center',
        dataIndex: 'instructionStatus',
        render: (text, record) => {
          if (record.instructionStatus2) {
          return <span>{record.instructionStatus2Meaning}</span>;
          } else {
          return <span>{record.instructionStatus1Meaning}</span>;
          }
        },
      },
      {
        title: '料废调换数量',
        dataIndex: 'exchangeQty',
        width: 110,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.poLineNum`).d('采购订单行号'),
        width: 110,
        dataIndex: 'poLineNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcVersion`).d('IQC版本'),
        width: 110,
        dataIndex: 'iqcVersion',
        align: 'center',
      },
      {
        title: '特采标识',
        dataIndex: 'uaiFlag',
        width: 90,
        align: 'center',
        render: (_value, record) => (record.uaiFlag === 'Y' ? '是' : '否'),
      },
      {
        title: '已接收数量',
        dataIndex: 'coverQty',
        width: 100,
        align: 'center',
      },
      {
        title: '已入库数量',
        dataIndex: 'stockedQty',
        width: 100,
        align: 'stockedQty',
      },
      {
        title: '已料废调换数量',
        dataIndex: 'exchangedQty',
        width: 140,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('接收仓库'),
        dataIndex: 'locatorCode',
        width: 140,
        align: 'center',
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
        title: '操作',
        dataIndex: 'operations',
        fixed: 'right',
        width: 120,
        align: 'center',
        render: (value, record, index) => (
          <div>
            <a onClick={() => barcodeCreate(record)}>条码创建</a>&nbsp;&nbsp;
            <a onClick={() => this.props.detailClick(record, value, index)}>明细</a>
          </div>
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
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
