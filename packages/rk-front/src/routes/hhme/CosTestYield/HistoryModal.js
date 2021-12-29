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
      title: 'cos类型',
      width: 120,
      dataIndex: 'cosTypeMeaning',
    },
    {
      title: '目标良率',
      width: 100,
      dataIndex: 'targetPassRate',
      render: val => `${val}%`,
    },
    {
      title: '来良良率',
      dataIndex: 'inputPassRate',
      width: 100,
      render: val => `${val}%`,
    },
    {
      title: '备注',
      width: 150,
      dataIndex: 'remark',
    },
    {
      title: '有效性',
      width: 120,
      dataIndex: 'enableFlagMeaning',
    },
    {
      title: '创建人',
      width: 100,
      dataIndex: 'createByName',
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'creationDate',
    },
    {
      title: '更新人',
      width: 100,
      dataIndex: 'lasteUpdateByName',
      align: 'center',
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
