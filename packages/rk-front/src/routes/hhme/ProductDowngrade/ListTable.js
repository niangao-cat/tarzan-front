import React from 'react';
import { Table } from 'hzero-ui';

import { tableScrollWidth } from 'utils/utils';

const ListTable = (props) => {

  const handleSearch = (page) => {
    const { onSearch } = props;
    if(onSearch) {
      onSearch(page);
    }
  };

  const handleClickRecord = (record) => {
    const { onClickRecord } = props;
    if(onClickRecord) {
      onClickRecord(record);
    }
  };

  const columns = [
    {
      title: '产品编码',
      width: 80,
      dataIndex: 'materialCode',
      render: (val, record) => (
        <a onClick={() => handleClickRecord(record)}>{val}</a>
      ),
    },
    {
      title: '产品描述',
      width: 100,
      dataIndex: 'materialName',
    },
    {
      title: '降级代码',
      width: 80,
      dataIndex: 'ncCode',
    },
    {
      title: '降级代码描述',
      width: 80,
      dataIndex: 'description',
    },
    {
      title: '降级物料编码',
      width: 120,
      dataIndex: 'transitionMaterialCode',
    },
    {
      title: '降级物料编码描述',
      width: 120,
      dataIndex: 'transitionMaterialName',
    },
    {
      title: '有效性',
      width: 120,
      dataIndex: 'enableFlagMeaning',
    },
  ];

  const { loading, dataSource, pagination, rowSelection } = props;

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      loading={loading}
      rowKey="downgradeId"
      rowSelection={rowSelection}
    />
  );
};

export default ListTable;
