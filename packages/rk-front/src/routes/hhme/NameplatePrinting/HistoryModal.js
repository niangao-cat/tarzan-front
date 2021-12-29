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
      title: '类型',
      width: 120,
      dataIndex: 'typeMeaning',
    },
    {
      title: '内部识别码',
      width: 150,
      dataIndex: 'identifyingCode',
    },
    {
      title: '头表-是否有效',
      dataIndex: 'enableFlagHeaderMeaning',
      width: 100,
    },
    {
      title: '头表-更新人',
      width: 100,
      dataIndex: 'lastUpdatedByHeaderName',
    },
    {
      title: '头表-更新时间',
      width: 150,
      dataIndex: 'lastUpdateDateHeader',
    },
    {
      title: '物料编码',
      width: 100,
      dataIndex: 'materialCode',
      align: 'center',
    },
    {
      title: '物料描述',
      width: 100,
      dataIndex: 'materialName',
    },
    {
      title: '数量',
      width: 100,
      dataIndex: 'qty',
    },
    {
      title: '行表-是否有效',
      width: 120,
      dataIndex: 'enableFlagLineMeaning',
    },
    {
      title: '行表-更新人',
      width: 100,
      dataIndex: 'lastUpdatedByLineName',
    },
    {
      title: '行表-更新时间',
      width: 150,
      dataIndex: 'lastUpdateDateLine',
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
