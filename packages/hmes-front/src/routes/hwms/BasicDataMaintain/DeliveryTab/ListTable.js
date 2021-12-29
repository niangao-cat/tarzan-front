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
        title: intl.get(`${modelPrompt}.warehouseCategory`).d('仓库类型'),
        dataIndex: 'warehouseCategoryCode',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.warehouseCategoryName`).d('仓库类型描述'),
        dataIndex: 'warehouseCategoryDescription',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.site`).d('仓库所属工厂'),
        dataIndex: 'siteName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productionLine`).d('送达产线'),
        dataIndex: 'prodLineCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productionLineName`).d('产线描述'),
        dataIndex: 'prodLineName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.personStandardTime`).d('人工送料时间(min)'),
        dataIndex: 'personStandardTime',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.AGVStandardTime`).d('AGV送料时间(min)'),
        dataIndex: 'agvStandardTime',
        width: 200,
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
        rowKey="deliveryTimeId"
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
