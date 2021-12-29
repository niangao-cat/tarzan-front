import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';


export default class HeadTable extends React.Component {

  @Bind()
  handleSearch(page) {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch(page);
    }
  }

  @Bind()
  handleGetBomComponentClassName(record) {
    if(record.bomSubstituteGroup || record.globalSubstituteGroup) {
      return {
        style: {
          backgroundColor: '#d5dfe9',
        },
      };
    }
  }

  @Bind()
  handleGetSumClassName(record) {
    if(record.bomSubstituteGroup || record.globalSubstituteGroup) {
      return {
        style: {
          backgroundColor: 'rgb(245, 239, 187)',
        },
      };
    }
  }

  render() {
    const { loading, pagination, dataSource } = this.props;
    const columns = [
      {
        title: '序号',
        width: 80,
        align: 'center',
        fixed: 'left',
        dataIndex: 'sequenceNum',
      },
      {
        title: '工单号',
        width: 100,
        fixed: 'left',
        align: 'center',
        dataIndex: 'workOrderNum',
      },
      {
        title: '工单状态',
        width: 80,
        fixed: 'left',
        align: 'center',
        dataIndex: 'workOrderStatusMeaning',
      },
      {
        title: '工单版本',
        width: 80,
        fixed: 'left',
        dataIndex: 'productionVersion',
        align: 'center',
      },
      {
        title: '版本描述',
        width: 120,
        fixed: 'left',
        align: 'center',
        dataIndex: 'productionVersionDescription',
      },
      {
        title: '工单类型',
        width: 120,
        align: 'center',
        fixed: 'left',
        dataIndex: 'workOrderTypeMeaning',
      },
      {
        title: '产品编码',
        width: 120,
        align: 'center',
        dataIndex: 'assemblyMaterialCode',
      },
      {
        title: '产品描述',
        dataIndex: 'assemblyMaterialName',
        align: 'center',
        width: 120,
      },
      {
        title: '工单数量',
        width: 90,
        align: 'center',
        dataIndex: 'woQuantity',
      },
      {
        title: '完成数量',
        width: 100,
        align: 'center',
        dataIndex: 'completedQuantity',
      },
      {
        title: '产线',
        width: 100,
        align: 'center',
        dataIndex: 'prodLineName',
      },
      {
        title: '工段',
        dataIndex: 'workcellName',
        align: 'center',
        width: 100,
      },
      {
        title: '组件行',
        dataIndex: 'bomLineNumber',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '物料编码',
        dataIndex: 'componentMaterialCode',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '物料描述',
        dataIndex: 'componentMaterialName',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: 'BOM替代组',
        dataIndex: 'bomSubstituteGroup',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '全局替代组',
        dataIndex: 'globalSubstituteGroup',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '单位用量',
        dataIndex: 'usageQty',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '单位',
        dataIndex: 'uomName',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '需求数量',
        dataIndex: 'demandQuantity',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '损耗率',
        dataIndex: 'attritionChance',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '损耗上限',
        dataIndex: 'attritionLimit',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '装配数量',
        dataIndex: 'assemblyQuantity',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '材料不良报废',
        dataIndex: 'materialNcScrapQty',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '工序不良报废',
        dataIndex: 'processNcScrapQty',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '实物报损数量',
        dataIndex: 'scrappedQuantity',
        align: 'center',
        width: 80,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '计划内报损',
        dataIndex: 'plannedScrappedQuantity',
        align: 'center',
        width: 90,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '计划外报损',
        dataIndex: 'unplannedScrappedQuantity',
        align: 'center',
        width: 90,
        onCell: this.handleGetBomComponentClassName,
      },
      {
        title: '实物损耗率',
        dataIndex: 'materialAttritionChance',
        align: 'center',
        width: 80,
        onCell: this.handleGetSumClassName,
      },
      {
        title: '损耗率差异',
        dataIndex: 'attritionChanceDifference',
        align: 'center',
        width: 100,
        onCell: this.handleGetSumClassName,
      },
      {
        title: '是否超工单报损',
        dataIndex: 'attritionOverFlagMeaning',
        align: 'center',
        width: 100,
        onCell: this.handleGetSumClassName,
      },
      {
        title: '不良待处理数量',
        dataIndex: 'pendingNcQuantity',
        align: 'center',
        width: 100,
        onCell: this.handleGetBomComponentClassName,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={this.handleSearch}
        loading={loading}
        rowKey="stocktakeId"
      />
    );
  }
}
