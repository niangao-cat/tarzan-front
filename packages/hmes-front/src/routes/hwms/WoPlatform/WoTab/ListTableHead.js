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
    const modelPrompt1 = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPromp2 = 'hwms.woPlatform.model.woPlatform';
    const {
      loading,
      dataSource,
      pagination,
      selectedRowKeys,
      onSelectRow,
      onSearch,
      onSearchLine,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.sequence`).d('序号'),
        width: 120,
        align: 'center',
        render: (value, record, index) => <a onClick={() => onSearchLine(record)}>{index + 1}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.planedStartTime`).d('计划生产时间'),
        dataIndex: 'planedStartTime',
        width: 150,
        align: 'center',
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt1}.siteCode`).d('工厂'),
        dataIndex: 'site',
        width: 150,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.productionLine`).d('产线'),
        dataIndex: 'productionLine',
        width: 150,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.planedMaterialCode`).d('计划物料号'),
        dataIndex: 'planedMaterialCode',
        width: 150,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt1}.workOrderNum`).d('生产订单号'),
        dataIndex: 'workOrderNum',
        width: 150,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.quantity`).d('数量'),
        dataIndex: 'quantity',
        width: 120,
        align: 'center',
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        dataIndex: 'unitOfMaterial',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.demandListStatus`).d('备料状态'),
        dataIndex: 'statusMeaning',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.workOrderStatus`).d('生产订单状态'),
        dataIndex: 'workOrderStatusMeaning',
        width: 200,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
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
