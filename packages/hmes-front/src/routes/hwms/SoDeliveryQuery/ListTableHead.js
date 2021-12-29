import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';
import { dateRender } from 'utils/renderer';
import { Bind } from 'lodash-decorators';

class ListTable extends Component {
  /**
   * 新窗口查看图片
   * @param value
   */
  @Bind()
  scanImg(value) {
    window.open(value, '_blank');
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.soDeliveryQuery.model.soDeliveryQuery';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.site`).d('工厂'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.soDeliveryNum`).d('出货单号'),
        dataIndex: 'instructionDocNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'instructionDocStatusMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.customerCode`).d('客户编码'),
        dataIndex: 'customerCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.customerName`).d('客户名称'),
        dataIndex: 'customerName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.expectDeliveryDate`).d('计划发货日期'),
        dataIndex: 'expectDeliveryDate',
        width: 150,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt}.deliveryAddress`).d('送货地址'),
        dataIndex: 'deliveryAddress',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.invoiceNum`).d('发票号'),
        dataIndex: 'invoiceNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.customerTestFlag`).d('是否需要客验'),
        dataIndex: 'customerTestFlagMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.customerAcceptFlag`).d('客验是否通过'),
        dataIndex: 'customerAcceptFlagMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.releaseFlag`).d('是否放行'),
        dataIndex: 'releaseFlagMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.credit`).d('信用评级'),
        dataIndex: 'creditMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.fileAddress`).d('文档地址'),
        dataIndex: 'fileAddress',
        width: 300,
        render: value => {
          return (
            <span className="action-link">
              <a onClick={() => this.scanImg(value)}>{value}</a>
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.demandDate`).d('请求交货日期'),
        dataIndex: 'demandDate',
        width: 200,
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
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
export default ListTable;
