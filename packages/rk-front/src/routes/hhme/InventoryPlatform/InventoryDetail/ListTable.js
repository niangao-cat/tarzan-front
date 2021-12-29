import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';

export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: "盘点单号",
        width: 100,
        dataIndex: 'stocktakeNum',
      },
      {
        title: "工单编号",
        width: 100,
        dataIndex: 'workOrderNum',
      },
      {
        title: "BOM版本号",
        width: 100,
        dataIndex: 'bomProductionVersion',
      },
      {
        title: "BOM版本描述",
        width: 100,
        dataIndex: 'bomProductionVersionDesc',
      },

      {
        title: "物料编码",
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '物料组',
        width: 120,
        dataIndex: 'itemGroup',
      },
      {
        title: '产线编码',
        width: 120,
        dataIndex: 'prodLineCode',
      },
      {
        title: '产线名称',
        width: 120,
        dataIndex: 'prodLineName',
      },
      {
        title: '工序编码',
        width: 80,
        dataIndex: 'workcellCode',
      },
      {
        title: '工序名称',
        width: 120,
        dataIndex: 'workcellName',
      },
      {
        title: '实物条码',
        width: 80,
        dataIndex: 'materialLotCode',
      },
      {
        title: '返修条码',
        width: 80,
        dataIndex: 'repairMaterialLotCode',
      },
      {
        title: '条码容器',
        width: 80,
        dataIndex: 'currentContainerCode',
      },
      {
        title: '返修标识',
        width: 80,
        dataIndex: 'reworkFlagMeaning',
      },
      {
        title: '账面数量',
        width: 80,
        dataIndex: 'currentQuantity',
      },
      {
        title: '单位',
        width: 80,
        dataIndex: 'uomCode',
      },
      {
        title: '初盘数量',
        width: 80,
        dataIndex: 'firstcountQuantity',
      },
      {
        title: '初盘产线',
        width: 80,
        dataIndex: 'firstcountProdLineCode',
      },
      {
        title: '初盘工序',
        width: 80,
        dataIndex: 'firstcountWorkcellCode',
      },
      {
        title: '复盘数量',
        width: 80,
        dataIndex: 'recountQuantity',
      },
      {
        title: '复盘产线',
        width: 80,
        dataIndex: 'recountProdLineCode',
      },
      {
        title: '复盘工序',
        width: 80,
        dataIndex: 'recountWorkcellCode',
      },
      {
        title: '初盘差异',
        width: 80,
        dataIndex: 'firstcountDiff',
      },
      {
        title: '复盘差异',
        width: 80,
        dataIndex: 'recountDiff',
      },
      {
        title: '初盘人',
        width: 80,
        dataIndex: 'firstcountByName',
      },
      {
        title: '初盘时间',
        width: 80,
        dataIndex: 'firstcountDate',
      },
      {
        title: '初盘备注',
        width: 80,
        dataIndex: 'firstcountRemark',
      },
      {
        title: '复盘人',
        width: 80,
        dataIndex: 'recountByName',
      },
      {
        title: '复盘时间',
        width: 80,
        dataIndex: 'recountDate',
      },
      {
        title: '复盘备注',
        width: 80,
        dataIndex: 'recountRemark',
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
