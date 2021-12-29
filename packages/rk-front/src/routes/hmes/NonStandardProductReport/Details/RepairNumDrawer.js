/*
 * @Description: 完工数量（明细）
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-12-14 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-06-12 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ nonStandardProductReport, loading }) => ({
  nonStandardProductReport,
  fetchLoading: loading.effects['nonStandardProductReport/fetchrepairNumList'],
}))
@Form.create({ fieldNameProp: null })
export default class RepairNumDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { repairNumDrawer, onRequireNumCancel, onRepairNumSearch, dataSource, pagination, fetchLoading } = this.props;
    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: 'EO编码',
        dataIndex: 'eoNum',
      },
      {
        title: 'SN',
        dataIndex: 'identification',
      },
      {
        title: '计划完工时间',
        dataIndex: 'planStartTime',
      },
      {
        title: '实际完工时间',
        dataIndex: 'actualEndTime',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={repairNumDrawer}
        onCancel={onRequireNumCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={fetchLoading}
          rowKey="eoNum"
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onRepairNumSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
