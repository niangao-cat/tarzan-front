import React from 'react';
import { Table } from 'hzero-ui';
import { uniq } from 'lodash';

import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

import styles from '../index.less';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const RuleTableList = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const handleRenderRow = (record) => {
    const { dataSource = [] } = props;
    const list = uniq(dataSource.map(e => e.groupNum));
    const first = list.indexOf(record.groupNum);
    if (!record.groupNum) {
      return null;
    } else if (first % 2 === 0) {
      return styles['pumpFilter_blue-color'];
    } else {
      return styles['pumpFilter_yellow-color'];
    }
  };

  const { loading, dataSource, pagination, rowSelection } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.exceptionType`).d('序号'),
      width: 80,
      dataIndex: 'orderSeq',
      render: (val, record, index) => {
        const { pageSize, current } = pagination;
        return pageSize * (current - 1) + index + 1;
      },
    },
    {
      title: intl.get(`${commonModelPrompt}.selectionLot`).d('筛选批次'),
      width: 120,
      dataIndex: 'selectionLot',
    },
    {
      title: intl.get(`${commonModelPrompt}.combMaterialCode`).d('组合物料编号'),
      width: 120,
      dataIndex: 'combMaterialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.revision`).d('BOM版本号'),
      width: 120,
      dataIndex: 'revision',
    },
    {
      title: intl.get(`${commonModelPrompt}.oldContainerCode`).d('原容器号'),
      width: 120,
      dataIndex: 'oldContainerCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.newContainerCode`).d('目标容器'),
      width: 120,
      dataIndex: 'newContainerCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialLotCode`).d('泵浦源SN'),
      width: 120,
      dataIndex: 'materialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('泵浦源物料编号'),
      width: 120,
      dataIndex: 'materialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
      width: 100,
      dataIndex: 'materialName',
    },
    {
      title: intl.get(`${commonModelPrompt}.statusMeaning`).d('状态'),
      width: 120,
      dataIndex: 'statusMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.selectionOrder`).d('挑选顺序'),
      width: 120,
      dataIndex: 'selectionOrder',
    },
    {
      title: intl.get(`${commonModelPrompt}.creationDate`).d('筛选时间'),
      width: 150,
      dataIndex: 'creationDate',
    },
  ];

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey='materialLotId'
      pagination={pagination}
      scroll={{ x: tableScrollWidth(columns) }}
      onChange={handleSearch}
      rowSelection={rowSelection}
      loading={loading}
      rowClassName={handleRenderRow}
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default RuleTableList;
