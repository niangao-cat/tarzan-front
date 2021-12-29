/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Modal, Table } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import { tableScrollWidth, getDateFormat } from 'utils/utils';

import styles from '../index.less';

@connect(({ distributionDemandPlatform }) => ({
  distributionDemandPlatform,
}))
export default class DataRecordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 校验并缓存当前数据
   *
   * @memberof ElevatorInfo
   */
  @Bind()
  handleSave() {
    const { onSave, colDataSelectRows } = this.props;
    if(onSave) {
      onSave(colDataSelectRows);
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal, dispatch } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
    dispatch({
      type: 'distributionDemandPlatform/updateState',
      payload: {
        colDataSelectRows: [],
      },
    });
  }

  /**
   * 勾选数据时触发
   * @param {Object} record - 勾选此条行数据
   * @param {Boolean} selected - 勾选状态
   */
  @Bind()
  forHeadSelect(record, selected) {
    const { backFlushFlag, withColData, colDataSelectRows, dispatch } = this.props;
    // 如果校验后返回的flag为Y，且勾选的数据为第二天的数据，则同时勾选ABC三个班次，取消勾选也同步
    if (backFlushFlag === 'Y' && withColData.indexOf(record) > -1) {
      if (selected) {
        withColData.forEach(item => {
          colDataSelectRows.push(item);
        });
      } else {
        withColData.forEach(item => {
          const selectIndex = colDataSelectRows.indexOf(item);
          colDataSelectRows.splice(selectIndex, 1);
        });
      }
      dispatch({
        type: 'distributionDemandPlatform/updateState',
        payload: {
          colDataSelectRows,
        },
      });
    }
  }

  render() {
    const { dataSource = [], visible, loading, colDataSelectRows = [], dispatch, createLoading } = this.props;
    const rowSelection = {
      columnWidth: 10,
      selectedRowKeys: colDataSelectRows.map(e => e.calendarShiftIdCopy),
      onChange: (keys, records) => {
        dispatch({
          type: 'distributionDemandPlatform/updateState',
          payload: {
            colDataSelectRows: records,
          },
        });
      },
      onSelect: this.forHeadSelect,
      getCheckboxProps: record => ({
        disabled: !record.calendarShiftId,
      }),
    };
    const columns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '日期',
        width: 80,
        dataIndex: 'shiftDate',
        render: val => moment(val).format(getDateFormat()),
      },
      {
        title: '班次',
        dataIndex: 'shiftCode',
        width: 120,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={500}
        title='勾选班次生成配送单'
        visible={visible}
        onCancel={this.handleCloseModal}
        onOk={this.handleSave}
        confirmLoading={createLoading}
      >
        <div className={styles['head-table']}>
          <Table
            scroll={{
                x: tableScrollWidth(columns),
              }}
            bordered
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            rowKey='calendarShiftIdCopy'
            dataSource={dataSource}
            pagination={false}
            style={{ marginBottom: 16 }}
          />
          <span>提示：若物料启用线边库存逻辑，且勾选了明天的班次，配送需求将会汇总明天所有班次的数量并扣减线边库存；其他时间按照原需求配送。</span>
        </div>
      </Modal>
    );
  }
}
