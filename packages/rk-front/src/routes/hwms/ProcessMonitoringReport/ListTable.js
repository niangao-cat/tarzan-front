import React from 'react';
import { Table, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';


export default class HeadTable extends React.Component {

  @Bind()
  handleSearch(page) {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch(page);
    }
  }

  @Bind()
  handleClickRow(record) {
    if (record.flag === '是') {
      return styles['data-click-production-execution-whole-process-monitoring'];
    } else {
      return '';
    }
  }

  render() {
    const { loading, pagination, dataSource } = this.props;
    const columns = [
      {
        title: '站点',
        dataIndex: 'siteCode',
        width: 80,
      },
      {
        title: '制造部',
        dataIndex: 'areaCode',
        width: 80,
      },
      {
        title: '生产线',
        dataIndex: 'prodLineCode',
        width: 80,
      },
      {
        title: '工单编号',
        dataIndex: 'workOrderNum',
        width: 140,
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 100,
      },
      {
        title: '工单类型',
        dataIndex: 'workoderType',
        width: 120,
      },
      {
        title: '工单状态',
        dataIndex: 'workoderStatus',
        width: 100,
      },
      {
        title: '工单物料编码',
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: '工单物料描述',
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: '工单物料组',
        dataIndex: 'itemGroup',
        width: 100,
      },
      {
        title: '工单物料组描述',
        dataIndex: 'itemGroupDescription',
        width: 120,
      },
      {
        title: '工单数量',
        dataIndex: 'qty',
        width: 100,
      },
      {
        title: '下达EO数量',
        dataIndex: 'releasedQty',
        width: 100,
      },
      {
        title: '工单在制数量',
        dataIndex: 'wipQty',
        width: 120,
      },
      {
        title: '工单报废数量',
        dataIndex: 'abandonQty',
        width: 120,
      },
      {
        title: '工单完工数量',
        dataIndex: 'completedQty',
        width: 120,
      },
      {
        title: '工单完工率',
        dataIndex: 'woCompleteRate',
        width: 100,
      },
      {
        title: 'EO完工率',
        dataIndex: 'eoCompleteRate',
        width: 100,
      },
      {
        title: '工单已入库数量',
        dataIndex: 'woinstorkQty',
        width: 120,
      },
      {
        title: '工单待入库数量',
        dataIndex: 'wonotinstorkQty',
        width: 120,
      },
      {
        title: '工单入库率',
        dataIndex: 'wonotinstorkRate',
        width: 120,
      },
      {
        title: '产品物料编码',
        dataIndex: 'proMaterialCode',
        width: 120,
      },
      {
        title: '是否主产品',
        dataIndex: 'flag',
        width: 100,
      },
      {
        title: '产品完工数量',
        dataIndex: 'countQty',
        width: 120,
      },
      {
        title: '产品完工率',
        dataIndex: 'countQtyRate',
        width: 100,
        render: val => <span style={{ color: 'red' }}>{val}</span>,
      },
      {
        title: '产品入库数量',
        dataIndex: 'eonotinstorkQty',
        width: 120,
      },
      {
        title: '产品待入库数量',
        dataIndex: 'eotinstorkQty',
        width: 120,
      },
      {
        title: '产品物料组',
        dataIndex: 'proItemGroup',
        width: 120,
      },
      {
        title: '产品物料组描述',
        dataIndex: 'proItemGroupDescription',
        width: 120,
      },
      {
        title: '工作令号',
        dataIndex: 'workNum',
        width: 100,
      },
      {
        title: '销售订单号',
        dataIndex: 'soNum',
        width: 120,
      },
      {
        title: '销售订单行号',
        dataIndex: 'soLineNum',
        width: 120,
      },
      {
        title: '工单实际完成时间',
        dataIndex: 'actualEndDate',
        width: 150,
      },
      {
        title: 'ERP创建日期',
        dataIndex: 'erpCreateDate',
        width: 150,
      },
      {
        title: 'ERP下达日期',
        dataIndex: 'erpRealeseDate',
        width: 150,
      },
      {
        title: '工单备注',
        dataIndex: 'remark',
        width: 100,
      },
      {
        title: '长文本',
        dataIndex: 'longText',
        align: 'center',
        width: 100,
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>{val}</Tooltip>
        ),
      },
      {
        title: '生产管理员',
        dataIndex: 'userCode',
        width: 120,
      },
      {
        title: '执行作业明细',
        dataIndex: 'releasedQty',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <a className="action-link" onClick={() => this.gotoWorkShop(record)}>
            {val}
          </a>
        ),
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
        rowClassName={this.handleClickRow}
      />
    );
  }
}
