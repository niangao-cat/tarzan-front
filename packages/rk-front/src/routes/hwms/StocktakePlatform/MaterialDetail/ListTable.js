import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadTable extends React.Component {


  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.exceptionType`).d('物料编码'),
        width: 100,
        align: 'center',
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionCode`).d('物料描述'),
        width: 100,
        align: 'center',
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('批次'),
        width: 120,
        align: 'center',
        dataIndex: 'lotCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('货位'),
        width: 80,
        align: 'center',
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.currentQuantity`).d('账面数量'),
        width: 80,
        align: 'center',
        dataIndex: 'currentQuantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.currentQty`).d('初盘数量'),
        width: 120,
        align: 'center',
        dataIndex: 'firstcountQuantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.recountQuantity`).d('复盘数量'),
        width: 80,
        align: 'center',
        dataIndex: 'recountQuantity',
      },
      {
        title: intl.get(`${commonModelPrompt}.firstcountDifferentQuantity`).d('初盘差异'),
        dataIndex: 'firstcountDifferentQuantity',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.recountDifferentQuantity`).d('复盘差异'),
        dataIndex: 'recountDifferentQuantity',
        align: 'center',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedBy`).d('单位'),
        align: 'center',
        dataIndex: 'uomCode',
        width: 120,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
