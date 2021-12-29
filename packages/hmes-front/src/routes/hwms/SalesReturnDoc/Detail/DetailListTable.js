/**
 *销售退货单查询
 *@date：2019/11/11
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
        title: intl.get(`${commonModelPrompt}.lineNum`).d('行号'),
        width: 140,
        dataIndex: 'lineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode `).d('实物条码'),
        width: 120,
        align: 'center',
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotStatus`).d('条码状态'),
        width: 120,
        dataIndex: 'materialLotStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityStatus`).d('质量状态'),
        width: 120,
        align: 'center',
        dataIndex: 'qualityStatus',
      },
      {
        title: intl.get(`${commonModelPrompt}.containerCode`).d('容器条码'),
        width: 120,
        dataIndex: 'containerCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('数量'),
        width: 120,
        dataIndex: 'quantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        width: 120,
        dataIndex: 'uom',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${commonModelPrompt}.warehouseCode`).d('仓库'),
        width: 120,
        dataIndex: 'warehouseCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
        width: 120,
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.salesReturnDate`).d('销退时间'),
        width: 120,
        dataIndex: 'salesReturnDate',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.executedBy`).d('执行人'),
        width: 120,
        dataIndex: 'executedBy',
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
