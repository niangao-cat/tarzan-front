import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {

  render() {
    const { loading, dataSource, pagination, onSearch, colData } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.departmentName`).d('部门'),
        dataIndex: 'departmentName',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('产线'),
        dataIndex: 'prodLineName',
      },
      {
        title: intl.get(`${commonModelPrompt}.workcellName`).d('工段'),
        dataIndex: 'workcellName',
      },
      {
        title: intl.get(`${commonModelPrompt}.loginName`).d('工号'),
        dataIndex: 'loginName',
      },
      {
        title: intl.get(`${commonModelPrompt}.realName`).d('姓名'),
        dataIndex: 'realName',
      },
      ...colData.map(v => {
        return {
          title: `${v}`,
          children: [
            {
              title: '上岗时间',
              dataIndex: `${v}onTime`,
              align: 'center',
            },
            {
              title: '下岗时间',
              dataIndex: `${v}downTime`,
              align: 'center',
            },
            {
              title: '暂停时间',
              dataIndex: `${v}stopTime`,
              align: 'center',
            },
            {
              title: '暂停原因',
              dataIndex: `${v}reasonMeaning`,
              align: 'center',
            },
            {
              title: '班次',
              dataIndex: `${v}shiftCode`,
              align: 'center',
            },
          ],
        };
      }),
      {
        title: intl.get(`${commonModelPrompt}.numOfMonth`).d('月总计'),
        dataIndex: 'numOfMonth',
        align: 'center',
      },
    ];

    return (
      <div>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </div>
    );
  }
}
