// 导入必要工具包
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

// 导出表格显示数据
class MainTable extends Component {
  // 直接渲染
  render() {
    const commonModelPrompt = 'tarzan.hwms.iqcInspectBoard';
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.iqcNumber`).d('单据号'),
        dataIndex: 'iqcNumber',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商编码'),
        dataIndex: 'supplierName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.tagGroupCode`).d('检验组编码'),
        dataIndex: 'tagGroupCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedByName`).d('检验员'),
        dataIndex: 'lastUpdatedByName',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('不合格原因'),
        dataIndex: 'remark',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.inspectionFinishDate`).d('检验完成时间'),
        align: 'center',
        dataIndex: 'inspectionFinishDate',
        width: 120,
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
        scroll={{ x: tableScrollWidth(columns), y: 200 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default MainTable;
