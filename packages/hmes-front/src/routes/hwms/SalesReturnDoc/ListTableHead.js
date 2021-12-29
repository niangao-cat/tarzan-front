/**
 *销售退货单
 *@date：2019/11/7
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { dateRender } from 'utils/renderer';

class ListTableHead extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.salesReturnDocQuery.model.salesReturnDocQuery';
    const {
      loading,
      dataSource,
      pagination,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.site`).d('工厂'),
        width: 140,
        dataIndex: 'site',
      },
      {
        title: intl.get(`${commonModelPrompt}.salesReturnDocNum`).d('销退单号'),
        align: 'center',
        width: 150,
        dataIndex: 'salesReturnDocNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.docStatus`).d('单据状态'),
        align: 'center',
        width: 150,
        dataIndex: 'docStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.customerCode`).d('客户编码'),
        width: 200,
        dataIndex: 'customerCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.customerName`).d('客户名称'),
        width: 200,
        dataIndex: 'customerName',
      },
      {
        title: intl.get(`${commonModelPrompt}.salesReturnDate`).d('销退日期'),
        width: 200,
        dataIndex: 'salesReturnDate',
        render: dateRender,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
      },
    ];
    return (
      <Table
        bordered
        rowKey="instructionDocId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 250 }}
        rowSelection={{
          selectedRowKeys: selectedHeadKeys,
          type: 'radio', // 单选
          fixed: true,
          columnWidth: 50,
          onChange: onSelectHead,
        }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableHead;
