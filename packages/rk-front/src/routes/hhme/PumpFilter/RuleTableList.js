import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

import { tableScrollWidth } from 'utils/utils';


const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

const RuleTableList = (props) => {

  const { loading, dataSource } = props;
  const columns = [
    {
      title: intl.get(`${commonModelPrompt}.tagCode`).d('数据项'),
      width: 120,
      dataIndex: 'tagCode',
    },
    {
      title: intl.get(`${commonModelPrompt}.tagDescription`).d('数据项描述'),
      width: 120,
      dataIndex: 'tagDescription',
    },
    {
      title: intl.get(`${commonModelPrompt}.calculateTyp`).d('计算类型'),
      width: 120,
      dataIndex: 'calculateTypeMeaning',
    },
    {
      title: intl.get(`${commonModelPrompt}.minValue`).d('最小值'),
      width: 100,
      dataIndex: 'minValue',
    },
    {
      title: intl.get(`${commonModelPrompt}.maxValue`).d('最大值'),
      width: 80,
      dataIndex: 'maxValue',
    },
    {
      title: intl.get(`${commonModelPrompt}.value`).d('值'),
      width: 80,
      dataIndex: 'value',
    },
  ];

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      scroll={{ x: tableScrollWidth(columns) }}
      loading={loading}
      rowKey="ruleHeadId"
      bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
    />
  );
};

export default RuleTableList;
