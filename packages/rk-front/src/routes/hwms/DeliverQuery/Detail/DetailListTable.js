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
import { dateRender } from 'utils/renderer';

class DetailListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionNum`).d('送货单行号'),
        width: 140,
        dataIndex: 'instructionNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode `).d('条码号'),
        width: 120,
        align: 'center',
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.status`).d('条码状态'),
        width: 120,
        dataIndex: 'status',
      },
      {
        title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('条码数量'),
        width: 120,
        align: 'center',
        dataIndex: 'primaryUomQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.uomCode`).d('单位'),
        width: 120,
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料号'),
        width: 200,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryBatch`).d('接收批号'),
        width: 120,
        dataIndex: 'deliveryBatch',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('接收时间'),
        width: 120,
        align: 'center',
        dataIndex: 'creationDate',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.createdByName`).d('接收人'),
        width: 120,
        dataIndex: 'createdByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityBatch`).d('检验批号'),
        width: 120,
        dataIndex: 'qualityBatch',
      },
      {
        title: intl.get(`${commonModelPrompt}.qcCompleteTime`).d('检验完成时间'),
        width: 120,
        dataIndex: 'qcCompleteTime',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityStatus`).d('检验结果'),
        width: 120,
        dataIndex: 'qualityStatus',
      },
      {
        title: intl.get(`${commonModelPrompt}.instockByName`).d('入库人'),
        width: 120,
        dataIndex: 'instockByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.inLocatorTime`).d('入库时间'),
        width: 120,
        dataIndex: 'inLocatorTime',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.poLineLocationNum`).d('采购订单号'),
        width: 120,
        dataIndex: 'poLineLocationNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.poLineNum`).d('采购订单行号'),
        width: 120,
        dataIndex: 'poLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.poLineLocationNum`).d('发运号'),
        dataIndex: 'poLineLocationNum',
      },
    ];
    return (
      <Table
        bordered
        rowKey="materialLotId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default DetailListTable;
