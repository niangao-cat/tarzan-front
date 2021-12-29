/*
 * @Description: 列表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-19 10:00:20
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-13 15:18:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

export default class ListTable extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = '';
    const { loading, pagination, onSearch, getAuditDetail, iqcauditist } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('来源单号'),
        width: 90,
        dataIndex: 'instructionDocNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.iqcNumber`).d('检验单'),
        align: 'center',
        width: 80,
        dataIndex: 'iqcNumber',
        render: (text, record) => <a onClick={() => getAuditDetail(record)}>{text}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        width: 90,
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
        width: 90,
        dataIndex: 'materialName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialVersion`).d('物料版本'),
        width: 90,
        dataIndex: 'materialVersion',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.quantity`).d('来料数量'),
        dataIndex: 'quantity',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('仓库'),
        dataIndex: 'locatorCode',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商名称'),
        dataIndex: 'supplierName',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptLot`).d('接收批次'),
        dataIndex: 'receiptLot',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionTypeMeaning`).d('检验类型'),
        dataIndex: 'inspectionTypeMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFinishDate`).d('判定不合格时间'),
        dataIndex: 'inspectionFinishDate',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.createdDate`).d('到货时间'),
        dataIndex: 'createdDate',
        width: 90,
      },
      {
        title: intl.get(`${commonModelPrompt}.receiptRealName`).d('接收人'),
        dataIndex: 'receiptRealName',
        width: 80,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionStatusMeaning`).d('处理状态'),
        dataIndex: 'inspectionStatusMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.finalDecisionMeaning`).d('审核结果'),
        dataIndex: 'finalDecisionMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.auditOpinion`).d('审核意见'),
        dataIndex: 'auditOpinion',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.identificationMeaning`).d('是否加急'),
        dataIndex: 'identificationMeaning',
        width: 90,
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 240,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="iqcHeaderId"
        loading={loading}
        dataSource={iqcauditist}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
