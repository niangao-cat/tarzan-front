/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React from 'react';
import { Modal, Table } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';

import styles from './index.less';

const HistoryModal = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const columns = [
    {
      title: 'COS类型',
      width: 120,
      dataIndex: 'cosType',
    },
    {
      title: '测试对象',
      width: 150,
      dataIndex: 'testObjectMeaning',
    },
    {
      title: '测试类型',
      dataIndex: 'testTypeMeaning',
      width: 100,
    },
    {
      title: '测试数量',
      width: 100,
      dataIndex: 'testQty',
    },
    {
      title: '良率',
      width: 120,
      dataIndex: 'passRate',
      render: val => val ? `${val}%` : null,
    },
    {
      title: '有效性',
      width: 100,
      dataIndex: 'enableFlagMeaning',
    },
    {
      title: '优先级',
      width: 100,
      dataIndex: 'priority',
    },
    {
      title: '测试总量',
      width: 100,
      dataIndex: 'testSumQty',
      align: 'center',
    },
    {
      title: '目标良率',
      width: 100,
      dataIndex: 'addPassRate',
      render: val => val ? `${val}%` : null,
    },
    {
      title: '更新人',
      width: 100,
      dataIndex: 'lastUpdatedByName',
    },
    {
      title: '更新时间',
      width: 150,
      dataIndex: 'lastUpdateDate',
    },
  ];

  const { visible, loading, pagination, dataSource, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      width={1300}
      title='修改历史'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
    >
      <div className={styles['head-table']}>
        <Table
          scroll={{
            x: tableScrollWidth(columns),
          }}
          bordered
          loading={loading}
          columns={columns}
          rowKey='jobRecordId'
          dataSource={dataSource}
          pagination={pagination}
          onChange={handleSearch}
        />
      </div>
    </Modal>
  );
};

export default HistoryModal;
