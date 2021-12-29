import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';



const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const HeadList = (props) => {


  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const { loading, dataSource, pagination } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.monitorDocNum`).d('截留单据号'),
      width: 120,
      dataIndex: 'monitorDocNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.cosType`).d('COS类型'),
      width: 120,
      dataIndex: 'cosType',
    },
    {
      title: intl.get(`${commonModelPrompt}.prodLineCode`).d('产线'),
      width: 120,
      dataIndex: 'prodLineCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.wafer`).d('Wafer'),
      width: 120,
      dataIndex: 'wafer',
    },
    {
      title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单'),
      width: 120,
      dataIndex: 'workOrderNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.testPassRate`).d('测试当前良率'),
      width: 120,
      dataIndex: 'testPassRate',
    },
    {
      title: intl.get(`${commonModelPrompt}.incomeInputTotal`).d('来料录入总数'),
      width: 120,
      dataIndex: 'incomeInputTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.incomeInputBaseNum`).d('来料录入基准数'),
      width: 120,
      dataIndex: 'incomeInputBaseNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.qpSiteOutTotal`).d('取片出站总数'),
      width: 120,
      dataIndex: 'qpSiteOutTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.tpSiteInTotal`).d('贴片进站总数'),
      width: 120,
      dataIndex: 'tpSiteInTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.tpSiteOutTotal`).d('贴片出站总数'),
      width: 120,
      dataIndex: 'tpSiteOutTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.tpStayNum`).d('贴片滞留'),
      width: 120,
      dataIndex: 'tpStayNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.dxSiteInTotal`).d('打线进站总数'),
      width: 120,
      dataIndex: 'dxSiteInTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.dxSiteOutTotal`).d('打线出站总数'),
      width: 120,
      dataIndex: 'dxSiteOutTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.dxStayNum`).d('打线滞留'),
      width: 120,
      dataIndex: 'dxStayNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.csSiteInTotal`).d('测试进站总数'),
      width: 120,
      dataIndex: 'csSiteInTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.csSiteOutTotal`).d('测试出站总数'),
      width: 120,
      dataIndex: 'csSiteOutTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.csStayNum`).d('测试滞留'),
      width: 120,
      dataIndex: 'csStayNum',
    },
    {
      title: intl.get(`${commonModelPrompt}.mjSiteInTotal`).d('目检进站总数'),
      width: 120,
      dataIndex: 'mjSiteInTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.mjSiteOutTotal`).d('目检出站总数'),
      width: 80,
      dataIndex: 'mjSiteOutTotal',
    },
    {
      title: intl.get(`${commonModelPrompt}.mjStayNum`).d('目检滞留'),
      width: 80,
      dataIndex: 'mjStayNum',
    },
  ];

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      loading={loading}
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default HeadList;
