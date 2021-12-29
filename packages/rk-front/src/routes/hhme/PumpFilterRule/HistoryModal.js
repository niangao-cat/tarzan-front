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
      title: '物料编码',
      width: 120,
      dataIndex: 'materialCode',
    },
    {
      title: '物料描述',
      width: 150,
      dataIndex: 'materialName',
    },
    {
      title: '规则编码',
      dataIndex: 'ruleCode',
      width: 100,
    },
    {
      title: '泵浦源个数',
      width: 100,
      dataIndex: 'qty',
    },
    {
      title: '头表是否有效',
      width: 120,
      dataIndex: 'headEnableFlagMeaning',
    },
    {
      title: '头表更新人',
      width: 100,
      dataIndex: 'headRealName',
    },
    {
      title: '头表更新时间',
      width: 150,
      dataIndex: 'headLastUpdateDate',
    },
    {
      title: '参数代码',
      width: 100,
      dataIndex: 'parameterCode',
      align: 'center',
    },
    {
      title: '数据项',
      width: 100,
      dataIndex: 'tagCode',
    },
    {
      title: '数据项描述',
      width: 100,
      dataIndex: 'tagDescription',
    },
    {
      title: '计算类型',
      width: 60,
      dataIndex: 'calculateTypeMeaning',
    },
    {
      title: '最小值',
      width: 60,
      dataIndex: 'minValue',
    },
    {
      title: '最大值',
      width: 60,
      dataIndex: 'maxValue',
    },
    {
      title: '行表是否有效',
      width: 120,
      dataIndex: 'lineEnableFlagMeaning',
    },
    {
      title: '优先消耗',
      width: 120,
      dataIndex: 'priorityMeaning',
    },
    {
      title: '公式',
      width: 80,
      dataIndex: 'formula',
    },
    {
      title: '优先级',
      width: 80,
      dataIndex: 'sequence',
    },
    {
      title: '行表更新人',
      width: 100,
      dataIndex: 'lineRealName',
    },
    {
      title: '行表更新时间',
      width: 150,
      dataIndex: 'lineLastUpdateDate',
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
