import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

import { enableRender } from '../../../../utils/renderer';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {
  @Bind()
  handleToDetail(record) {
    const { history } = this.props;
    history.push(`/hmes/abnormal-collection/detail/${record.exceptionGroupId}`);
  }

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.exceptionGroupCode`).d('收集组编码'),
        width: 140,
        dataIndex: 'exceptionGroupCode',
        render: (val, record) => <a onClick={() => this.handleToDetail(record)}>{val}</a>,
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionGroupName`).d('收集组描述'),
        width: 140,
        dataIndex: 'exceptionGroupName',
      },
      {
        title: intl.get(`${commonModelPrompt}.enableFlag`).d('状态'),
        width: 80,
        dataIndex: 'enableFlag',
        render: val => enableRender(val),
      },
      {
        title: intl.get(`${commonModelPrompt}.exceptionGroupType`).d('业务类型'),
        width: 120,
        dataIndex: 'exceptionGroupTypeName',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdUserName`).d('创建人'),
        width: 120,
        dataIndex: 'createdUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 160,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdatedUserName`).d('修改人'),
        width: 160,
        dataIndex: 'lastUpdatedUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.lastUpdateDate`).d('修改时间'),
        dataIndex: 'lastUpdateDate',
        width: 160,
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns, 50) }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="exceptionGroupId"
      />
    );
  }
}
