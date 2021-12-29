import React from 'react';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';

import { tableScrollWidth } from 'utils/utils';



const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const HeadList = (props) => {


  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination, rowSelection } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.monitorDocNum`).d('良率监控单据'),
      width: 120,
      dataIndex: 'monitorDocNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.docStatusMeaning`).d('单据状态'),
      width: 120,
      dataIndex: 'docStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.checkStatusMeaning`).d('审核状态'),
      width: 120,
      dataIndex: 'checkStatusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
      width: 120,
      dataIndex: 'cosType',
    },
    {
      title: intl.get(`${commonModelPrompt}.wafer`).d('WAFER'),
      width: 120,
      dataIndex: 'wafer',
    },
    {
      title: intl.get(`${commonModelPrompt}.testPassRate`).d('COS良率'),
      width: 120,
      dataIndex: 'testPassRate',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
      width: 120,
      dataIndex: 'creationDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.passDate`).d('放行时间'),
      width: 120,
      dataIndex: 'passDate',
    },
    {
      title: intl.get(`${commonModelPrompt}.passByName`).d('放行人'),
      width: 120,
      dataIndex: 'passByName',
    },
  ];

  return (
    <EditTable
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      rowSelection={rowSelection}
      onChange={handleSearch}
      loading={loading}
      rowKey="cosMonitorHeaderId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;
