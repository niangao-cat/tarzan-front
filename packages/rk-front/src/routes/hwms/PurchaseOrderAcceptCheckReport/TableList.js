/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 采购订单接收检验统计报表
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
// import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const commonModelPrompt = 'tarzan.hwms.purchaseOrderAcceptCheckReport';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        dataIndex: 'sequence',
        width: '80',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('采购订单'),
        dataIndex: 'instructionDocNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierCode`).d('供应商'),
        dataIndex: 'supplierCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应描述'),
        dataIndex: 'supplierName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('采购订单行号'),
        dataIndex: 'instructionLineNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.demandTime`).d('计划到货时间'),
        dataIndex: 'demandTime',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryInstructionDocNum`).d('送货单'),
        dataIndex: 'deliveryInstructionDocNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryInstructionDocStatus`).d('送货单状态'),
        dataIndex: 'deliveryInstructionDocStatusMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryInstructionLineNum`).d('送货单行'),
        dataIndex: 'deliveryInstructionLineNum',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryInstructionLineStatus`).d('送货单行状态'),
        dataIndex: 'deliveryInstructionLineStatusMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receivedQty`).d('到货数量'),
        dataIndex: 'receivedQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.actualReceivedDate`).d('接收时间'),
        dataIndex: 'actualReceivedDate',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receivedFlag`).d('是否及时到货'),
        dataIndex: 'receivedFlag',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.poStockInQty`).d('检验合格数量'),
        dataIndex: 'poStockInQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.qualificationRate`).d('来料合格率'),
        dataIndex: 'qualificationRate',
        width: '100',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
