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
    const { loading, dataSource, pagination, onSearch, onEdit, onConsolidationRule } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.site`).d('工厂'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialCategoryCode`).d('物料类型编码'),
        dataIndex: 'materialCategoryCode',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.materialCategoryName`).d('物料类型描述'),
        dataIndex: 'materialCategoryDescription',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.deliveryMethod`).d('配送方式'),
        dataIndex: 'deliveryMethodMeaning',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.consolidatedFlag`).d('是否合并发料'),
        dataIndex: 'consolidatedFlag',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.consolidatedFlag === 'Y' ? 'success' : 'error'}
            text={
              record.consolidatedFlag === 'Y'
                ? intl.get(`hzero.common.status.enable`).d('启用')
                : intl.get(`hzero.common.status.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.trayLoadingFlag`).d('是否整托发料'),
        dataIndex: 'trayLoadingFlag',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.trayLoadingFlag === 'Y' ? 'success' : 'error'}
            text={
              record.trayLoadingFlag === 'Y'
                ? intl.get(`hzero.common.status.enable`).d('启用')
                : intl.get(`hzero.common.status.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.deliveryQtyPerTime`).d('单次配送量'),
        dataIndex: 'deliveryQtyPt',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.uom`).d('单位'),
        dataIndex: 'uomCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
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
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        fixed: 'right',
        width: 120,
        render: (value, record) => {
          return (
            record.materialCode && (
              <span className="action-link">
                <a onClick={() => onConsolidationRule(record)}>
                  {intl.get(`${modelPrompt}.consolidationRule`).d('合并规则维护')}
                </a>
              </span>
            )
          );
        },
      },
    ];
    return (
      <Table
        bordered
        rowKey="strategyId"
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
