/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description：cos 出站查询
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hwms.cosOutboundQuery';

export default class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单编号'),
          dataIndex: 'workOrderNum',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.productionCode`).d('产品编码'),
          dataIndex: 'productionCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.productionName`).d('产品描述'),
          dataIndex: 'productionName',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialLotCode`).d('芯片盒子'),
          dataIndex: 'materialLotCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.waferNum`).d('WAFER'),
          dataIndex: 'waferNum',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.cosType`).d('芯片类型编码'),
          dataIndex: 'cosType',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
          dataIndex: 'materialCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
          dataIndex: 'materialName',
          align: 'left',
        },
        {
          title: intl.get(`${commonModelPrompt}.primaryUomQty`).d('数量'),
          dataIndex: 'primaryUomQty',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.locatorCode`).d('货位'),
          dataIndex: 'locatorCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.assetEncoding`).d('设备编码'),
          dataIndex: 'assetEncoding',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.assetName`).d('设备描述'),
          dataIndex: 'assetName',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.eoStepNum`).d('工艺步骤加工次数'),
          dataIndex: 'eoStepNum',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.workcellCode`).d('当前工位'),
          dataIndex: 'workcellCode',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.workcellName`).d('工位名称'),
          dataIndex: 'workcellName',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.jobTypeMeaning`).d('作业平台类型'),
          dataIndex: 'jobTypeMeaning',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.siteInDate`).d('进站时间'),
          dataIndex: 'siteInDate',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.siteInBy`).d('进站人员'),
          dataIndex: 'siteInBy',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.siteOutDate`).d('出站时间'),
          dataIndex: 'siteOutDate',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.siteOutBy`).d('出站人员'),
          dataIndex: 'siteOutBy',
          align: 'center',
        },
        {
          title: intl.get(`${commonModelPrompt}.reworkflag`).d('是否返修标识'),
          dataIndex: 'reworkflag',
          align: 'center',
          render: val =>
            (
              [
                { typeCode: 'N', description: '否' },
                { typeCode: 'Y', description: '是' },
              ].filter(ele => ele.typeCode === val)[0] || {}
            ).description,
        },
      ],
    };
  }

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const { columns } = this.state;
    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={onSearch}
        loading={loading}
      />
    );
  }
}
