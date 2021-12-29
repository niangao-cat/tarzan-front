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
      width: 100,
      dataIndex: 'cosTypeMeaning',
    },
    {
      title: '电流点',
      width: 100,
      dataIndex: 'current',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    },
    {
      title: '创建人',
      width: 120,
      dataIndex: 'createdByName',
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'creationDate',
    },
    {
      title: '最近更新人',
      width: 120,
      dataIndex: 'lastUpdatedByName',
    },
    {
      title: '最近更新时间',
      width: 150,
      dataIndex: 'lastUpdateDate',
    },
    {
      title: '是否有效',
      width: 60,
      dataIndex: 'enbaleFlagMeaning',
    },
  ];

  const { visible, loading, pagination, dataSource, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      width={1100}
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
          rowKey='cosHisId'
          dataSource={dataSource}
          pagination={pagination}
          onChange={handleSearch}
        />
      </div>
    </Modal>
  );
};

export default HistoryModal;
