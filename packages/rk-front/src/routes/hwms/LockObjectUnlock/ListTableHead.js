/**
 *锁定对象解锁
 *@date：2020/9/15
 *@author：xinyu.wang <xinyu.wang02@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

class ListTableHead extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.LockObjectUnlock.model.LockObjectUnlock';
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      releaseLock,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.functionName`).d('功能名称'),
        width: 140,
        dataIndex: 'functionName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.deviceCode`).d('锁定设备'),
        align: 'center',
        width: 100,
        dataIndex: 'deviceCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.objectTypeMeaning`).d('锁定对象类型'),
        width: 120,
        dataIndex: 'objectTypeMeaning',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.objectRecordCode`).d('锁定对象编码'),
        width: 120,
        dataIndex: 'objectRecordCode',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdByName`).d('锁定人'),
        width: 120,
        dataIndex: 'createdByName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('锁定时间'),
        width: 120,
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 80,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a onClick={() => releaseLock(record, index)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d("解锁")}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Table
        bordered
        rowKey="lockId"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}

export default ListTableHead;
