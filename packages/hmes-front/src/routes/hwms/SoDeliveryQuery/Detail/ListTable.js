import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { dateRender } from 'utils/renderer';

class ListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.soDeliveryQuery.model.soDeliveryQuery';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.soDeliveryLineNum`).d('出货单行号'),
        width: 120,
        dataIndex: 'instructionLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotCode `).d('实物条码'),
        width: 120,
        dataIndex: 'materialLotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialLotStatus`).d('条码状态'),
        width: 120,
        dataIndex: 'materialLotStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.containerCode`).d('容器条码'),
        width: 120,
        dataIndex: 'containerCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('数量'),
        width: 120,
        align: 'center',
        dataIndex: 'actualQty',
      },
      {
        title: intl.get(`${commonModelPrompt}.uom`).d('单位'),
        width: 120,
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.lot`).d('批次'),
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryDate`).d('出货时间'),
        width: 120,
        align: 'center',
        dataIndex: 'deliveryDate',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.deliveryBy`).d('出货人'),
        width: 120,
        dataIndex: 'deliveryBy',
      },
      {
        title: intl.get(`${commonModelPrompt}.accountDate`).d('过账时间'),
        width: 120,
        align: 'center',
        dataIndex: 'accountDate',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.accountBy`).d('过账人'),
        dataIndex: 'accountBy',
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
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTable;
