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
    const modelPrompt = 'hwms.transactionType.model.transactionType';
    const { loading, dataSource, pagination, onSearch, onEdit } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.transactionTypeCode`).d('事务类型编码'),
        dataIndex: 'transactionTypeCode',
        width: 150,
        render: (value, record) => <a onClick={() => onEdit(record)}>{value}</a>,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('事务类型描述'),
        dataIndex: 'description',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.moveType`).d('移动类型'),
        dataIndex: 'moveType',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.processErpFlag`).d('事务是否回传ERP'),
        dataIndex: 'processErpFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.processErpFlag === 'Y' ? 'success' : 'error'}
            text={
              record.processErpFlag === 'Y'
                ? intl.get(`hzero.common.status.yes`).d('是')
                : intl.get(`hzero.common.status.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        align: 'center',
        width: 150,
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
        rowKey="transactionTypeId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: tableScrollWidth(columns) }}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
