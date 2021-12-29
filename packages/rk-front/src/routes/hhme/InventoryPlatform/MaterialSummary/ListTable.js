import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';

export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: '在制盘点投料汇总投料表',
        dataIndex: 'materialSummery',
        children: [
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
            title: "产品编码",
            width: 100,
            dataIndex: 'materialCode',
          },
          {
            title: '产品描述',
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
            title: '在制数量',
            width: 80,
            dataIndex: 'currentQuantity',
          },
          {
            title: '在制账面已投物料',
            width: 150,
            dataIndex: 'releaseMaterialCode',
          },
          {
            title: '在制账面已投物料描述',
            width: 150,
            dataIndex: 'releaseMaterialName',
          },
          {
            title: '单位用量',
            width: 100,
            dataIndex: 'qty',
          },
          {
            title: '在制账面已投物料数量',
            width: 150,
            dataIndex: 'releaseQty',
          },
          {
            title: '已走报废数量',
            width: 120,
            dataIndex: 'scrapQty',
          },
          {
            title: '单位',
            width: 80,
            dataIndex: 'uomCode',
          },
        ],
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
