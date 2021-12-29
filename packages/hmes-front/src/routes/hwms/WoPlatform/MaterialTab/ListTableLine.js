import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTableLine extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPromp1 = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPromp2 = 'hwms.woPlatform.model.woPlatform';
    const { loading, dataSource, pagination, onSearch, onSearchLine } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.sequence`).d('序号'),
        width: 80,
        align: 'center',
        render: (value, record, index) => <a onClick={() => onSearchLine(record)}>{index + 1}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.componentCode`).d('组件物料编码'),
        dataIndex: 'componentCode',
        width: 200,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.componentName`).d('组件物料描述'),
        dataIndex: 'componentName',
        width: 200,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.demandQty`).d('需求数'),
        dataIndex: 'demandQuantity',
        width: 120,
        align: 'center',
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.actualQty`).d('实际执行数'),
        dataIndex: 'actualQuantity',
        width: 100,
        align: 'center',
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.shipArea`).d('送达位置'),
        dataIndex: 'shipArea',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.targetWarehouse`).d('目标仓库'),
        dataIndex: 'targetWarehouse',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp2}.targetLocator`).d('目标货位'),
        dataIndex: 'targetLocator',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPromp1}.statusMeaning`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 120,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 200,
        render: (value, record) => <a onClick={() => onSearchLine(record)}>{value}</a>,
      },
    ];
    return (
      <Table
        bordered
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50), y: 200 }}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableLine;
