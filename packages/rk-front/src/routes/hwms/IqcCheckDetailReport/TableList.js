/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： IQC检验明细报表
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
// import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const commonModelPrompt = 'tarzan.hwms.iqcCheckDetailReport';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        dataIndex: 'sequence',
        width: '80',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcNumber`).d('检验单号'),
        dataIndex: 'iqcNumber',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionTypeMeaning`).d('检验类型'),
        dataIndex: 'inspectionTypeMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionStatusMeaning`).d('检验状态'),
        dataIndex: 'inspectionStatusMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierCode`).d('供应商'),
        dataIndex: 'supplierCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应描述'),
        dataIndex: 'supplierName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionResultMeaning`).d('检验结果'),
        dataIndex: 'inspectionResultMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.ngQty`).d('不良项'),
        dataIndex: 'ngQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptLot`).d('接收批次'),
        dataIndex: 'receiptLot',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.qcBy`).d('检验员'),
        dataIndex: 'qcBy',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.finalDecisionMeaning`).d('审批结果'),
        dataIndex: 'finalDecisionMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.auditOpinion`).d('审批意见'),
        dataIndex: 'auditOpinion',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateBy`).d('审核员'),
        dataIndex: 'lastUpdateBy',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspection`).d('检验项目'),
        dataIndex: 'inspection',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionDesc`).d('检验项目描述'),
        dataIndex: 'inspectionDesc',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardText`).d('文本规格值'),
        dataIndex: 'standardText',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardFrom`).d('规格范围从'),
        dataIndex: 'standardFrom',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.standardTo`).d('规格值范围至'),
        dataIndex: 'standardTo',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.sampleType`).d('抽样方案类型'),
        dataIndex: 'sampleType',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.sampleSize`).d('抽样数量'),
        dataIndex: 'sampleSize',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.acRe`).d('AC/RE'),
        dataIndex: 'acRe',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.lineInspectionResultMeaning`).d('结论'),
        dataIndex: 'lineInspectionResultMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.number`).d('序列号'),
        dataIndex: 'number',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.result`).d('测试值'),
        dataIndex: 'result',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionToolMeaning`).d('检验工具'),
        dataIndex: 'inspectionToolMeaning',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFinishDate`).d('检验完成时间'),
        dataIndex: 'inspectionFinishDate',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: '100',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
