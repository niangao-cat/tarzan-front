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


const HistoryModal = (props) => {

  const handleSearch = (page = {}) => {
    const { onSearch } = props;
    if (onSearch) {
      onSearch(page);
    }
  };

  const columns = [
    {
      title: '良率监控单据',
      width: 120,
      dataIndex: 'monitorDocNum',
    },
    {
      title: '单据状态',
      width: 100,
      dataIndex: 'docStatusMeaning',
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatusMeaning',
      width: 100,
    },
    {
      title: 'COS类型',
      width: 150,
      dataIndex: 'cosType',
    },
    {
      title: 'WAFER',
      width: 120,
      dataIndex: 'wafer',
    },
    {
      title: 'COS良率',
      width: 100,
      dataIndex: 'testPassRate',
    },
    {
      title: '创建时间',
      width: 120,
      dataIndex: 'creationDate',
    },
    {
      title: '放行时间',
      width: 150,
      dataIndex: 'passDate',
    },
    {
      title: '放行人',
      width: 100,
      dataIndex: 'passByName',
      align: 'center',
    },
  ];

  const { visible, loading, pagination, dataSource, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      width={1300}
      title='COS测试良率记录表'
      visible={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
    >
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
    </Modal>
  );
};

export default HistoryModal;
