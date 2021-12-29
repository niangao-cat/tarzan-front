import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableRow extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const { loading, pagination, onSearch } = this.props;
    const dataSource = [
      {
        sequence: 1,
        paixuma: '001',
      },
      {
        sequence: 2,
        paixuma: '002',
      },
      {
        sequence: 3,
        paixuma: '003',
      },
    ];
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 65,
        dataIndex: 'sequence',
        align: 'center',
      },
      {
        title: '检验项别',
        width: 85,
        dataIndex: 'paixuma',
        align: 'center',
      },
      {
        title: '检验项目',
        dataIndex: 'jyxm',
        width: 85,
        align: 'center',
      },
      {
        title: '检验项描述',
        dataIndex: 'jyxms',
        width: 95,
        align: 'center',
      },
      {
        title: '抽样方案类型',
        dataIndex: 'jyxlb',
        width: 105,
        align: 'center',
      },
      {
        title: '缺陷等级',
        width: 85,
        dataIndex: 'qxdj',
        align: 'center',
      },
      {
        title: '检验水平',
        width: 85,
        align: 'center',
        dataIndex: 'gglx',
      },
      {
        title: 'AQL值',
        dataIndex: 'jd',
        width: 70,
        align: 'center',
      },
      {
        title: '抽样数量',
        width: 85,
        dataIndex: 'poLineNum',
        align: 'center',
      },
      {
        title: 'AC/RE',
        dataIndex: 'uaiFlag',
        width: 80,
        align: 'center',
      },
      {
        title: '文本规格值',
        dataIndex: 'receivedQty',
        width: 95,
        align: 'center',
      },
      {
        title: '规格范围',
        dataIndex: 'exchangedQty',
        width: 85,
        align: 'center',
      },
      {
        title: '规格单位',
        dataIndex: 'operations',
        width: 85,
        align: 'center',
      },
      {
        title: '检验工具',
        dataIndex: 'operations',
        width: 85,
        align: 'center',
      },
      {
        title: '不良数',
        dataIndex: 'operations',
        width: 75,
        align: 'center',
      },
      {
        title: '合格数',
        dataIndex: 'enableflag',
        width: 75,
        align: 'center',
      },
      {
        title: '结论',
        dataIndex: 'remark',
        width: 60,
        align: 'center',
      },
      {
        title: '附件',
        dataIndex: 'remark',
        width: 60,
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableRow;
