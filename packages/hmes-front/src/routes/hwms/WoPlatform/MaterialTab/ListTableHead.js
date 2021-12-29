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
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPromp1 = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPromp2 = 'hwms.woPlatform.model.woPlatform';
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.sequence`).d('序号'),
        width: 120,
        render: (value, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPromp2}.demandListNum`).d('备料单号'),
        dataIndex: 'demandListNumber',
        width: 150,
      },
      {
        title: intl.get(`${modelPromp2}.PPStartTime`).d('预计备料开始时间'),
        dataIndex: 'planedStartTimeFrom',
        width: 200,
      },
      {
        title: intl.get(`${modelPromp1}.siteCode`).d('工厂'),
        dataIndex: 'site',
        width: 150,
      },
      {
        title: intl.get(`${modelPromp2}.productionLine`).d('产线'),
        dataIndex: 'productionLine',
        width: 150,
      },
      {
        title: intl.get(`${modelPromp2}.shipArea`).d('送达位置'),
        dataIndex: 'shipArea',
        width: 150,
      },
      {
        title: intl.get(`${modelPromp1}.wareHouse`).d('仓库'),
        dataIndex: 'warehouse',
        width: 150,
      },
      {
        title: intl.get(`${modelPromp1}.workOrderNum`).d('关联生产订单号'),
        dataIndex: 'workOrderNum',
        width: 200,
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
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 190 }}
        rowSelection={{
          fixed: true,
          type: 'radio',
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
