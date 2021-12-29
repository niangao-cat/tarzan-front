import React from 'react';
import { Table } from 'hzero-ui';
import { uniq } from 'lodash';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';

import styles from './index.less';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const RuleTableList = (props) => {

  const handleRenderRow = (record) => {
    const { dataSource = [] } = props;
    const list = uniq(dataSource.map(e => e.groupNum));
    const first = list.indexOf(record.groupNum);
    if (record.groupNum === null) {
      return null;
    } else if (first % 2 === 0) {
      return styles['pumpFilter_blue-color'];
    } else {
      return styles['pumpFilter_yellow-color'];
    }
  };

  const { loading, dataSource, rowSelection } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.tagCode`).d('原容器号'),
      width: 120,
      dataIndex: 'containerCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.tagDescription`).d('条码号'),
      width: 120,
      dataIndex: 'materialLotCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
      width: 120,
      dataIndex: 'materialCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.materialName`).d('物料描述'),
      width: 100,
      dataIndex: 'materialName',
    },
  ];

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={{ x: tableScrollWidth(columns), y: 520 }}
      rowSelection={rowSelection}
      loading={loading}
      rowKey="materialLotId"
      rowClassName={handleRenderRow}
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default RuleTableList;
