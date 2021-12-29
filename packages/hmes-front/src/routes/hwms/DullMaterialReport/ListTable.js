import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPrompt2 = 'hwms.scrapReport.model.scrapReport';
    const modelPrompt3 = 'hwms.barcodeQuery.model.barcodeQuery';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('实物条码'),
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.qty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt2}.dullDate`).d('呆滞日期'),
        dataIndex: 'dullDate',
        width: 160,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt2}.dullType`).d('呆滞类型'),
        dataIndex: 'dullType',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt2}.approvalResult`).d('评审结果'),
        dataIndex: 'reviewResult',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotStatus`).d('条码状态'),
        dataIndex: 'status',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.qualityStatus`).d('质量状态'),
        dataIndex: 'qualityStatus',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt2}.warehouse`).d('仓库'),
        dataIndex: 'warehouseCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt3}.containerCode`).d('容器条码'),
        dataIndex: 'containerCode',
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
        scroll={{ x: tableScrollWidth(columns, 50) }}
        rowSelection={{
          fixed: true,
          columnWidth: 50,
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
