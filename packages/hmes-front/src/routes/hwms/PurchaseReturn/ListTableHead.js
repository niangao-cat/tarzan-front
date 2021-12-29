import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableHead extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.purchaseReturn.model.purchaseReturn';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPromt2}.docNum`).d('单据号'),
        dataIndex: 'instructionDocNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.plantCode`).d('工厂'),
        dataIndex: 'siteCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.docStatus`).d('单据状态'),
        dataIndex: 'status',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商名称'),
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
        width: 160,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.demandTime`).d('计划退货时间'),
        dataIndex: 'demandTime',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPromt2}.executor`).d('执行人'),
        dataIndex: 'lastUpdatedBy',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.executionDate`).d('完成时间'),
        dataIndex: 'lastUpdateDate',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.returnMethod`).d('退货方式'),
        dataIndex: 'returnMethod',
        width: 120,
      },
      {
        title: intl.get(`${modelPromt2}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionDocId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          type: 'radio',
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
export default ListTableHead;
