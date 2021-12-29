import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';

import { tableScrollWidth } from 'utils/utils';


export default class HeadTable extends React.Component {

  @Bind()
  handleSearch(page) {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch(page);
    }
  }

  render() {
    const { loading, dataSource, pagination } = this.props;
    const columns = [
      {
        title: '工单号',
        width: 100,
        dataIndex: 'workOrderNum',
      },
      {
        title: '工单版本',
        width: 90,
        dataIndex: 'productionVersion',
      },
      {
        title: '工单物料编码',
        width: 100,
        dataIndex: 'woMaterialCode',
      },
      {
        title: '工单物料描述',
        width: 100,
        dataIndex: 'woMaterialName',
      },
      {
        title: '工单数量',
        width: 100,
        dataIndex: 'qty',
      },
      {
        title: '执行作业编码',
        width: 120,
        dataIndex: 'eoNum',
      },
      {
        title: '工序',
        width: 90,
        dataIndex: 'processName',
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 90,
      },
      {
        title: '用户',
        width: 90,
        dataIndex: 'loginName',
      },
      {
        title: '姓名',
        width: 80,
        dataIndex: 'realName',
      },
      {
        title: '操作平台',
        width: 120,
        dataIndex: 'jobTypeMeaning',
      },
      {
        title: 'SN编码',
        dataIndex: 'identification',
        width: 120,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料描述',
        width: 120,
        dataIndex: 'materialName',
      },
      {
        title: '物料版本',
        width: 100,
        dataIndex: 'materialVersion',
      },
      {
        title: 'BOM用量',
        width: 90,
        dataIndex: 'bomQty',
      },
      {
        title: '组件损耗率',
        dataIndex: 'attritionChance',
        width: 80,
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 80,
      },
      {
        title: '供应商批次',
        width: 120,
        dataIndex: 'lot',
      },
      {
        title: '投料条码',
        width: 180,
        dataIndex: 'materialLotCode',
      },
      {
        title: '投料数量',
        width: 90,
        dataIndex: 'releaseQty',
      },
      {
        title: '投料时间',
        dataIndex: 'creationDate',
        width: 150,
      },
      {
        title: '物料类型',
        dataIndex: 'attrValue',
        width: 80,
      },
      {
        title: '是否已投',
        width: 80,
        dataIndex: 'yn',
      },
      {
        title: '虚拟件标识',
        width: 80,
        dataIndex: 'virtualFlag',
        render: val => val === 'N' ? '否' : val === 'Y' ? '是' : null,
      },
      {
        title: '条码当前剩余数量',
        width: 120,
        dataIndex: 'primaryUomQty',
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
        rowKey={uuid()}
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
