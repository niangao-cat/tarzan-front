import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class ListTable extends Component {
  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialCategory`).d('物料类别'),
        dataIndex: 'materialCategoryCode',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialCategoryName`).d('物料类别描述'),
        dataIndex: 'materialCategoryDescription',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.site`).d('工厂'),
        dataIndex: 'siteName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.minimumQty`).d('最小数量'),
        dataIndex: 'minNumQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.maxmumQty`).d('最大数量'),
        dataIndex: 'maxNumQty',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.workingStandardTime`).d('备料时间(min)'),
        dataIndex: 'workStandardTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`hzero.common.status.enable`).d('启用')
                : intl.get(`hzero.common.status.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="preparingTimeId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
