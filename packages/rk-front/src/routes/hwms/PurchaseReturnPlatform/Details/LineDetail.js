/*
 * @Description: 行明细
 * @version: 0.1.0
 * @Author: ywj
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: ywj
 * @LastEditTime: 2020-09-20 16:06:05
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  fetchLoading: loading.effects['purchaseReturnPlatform/fetchLineDetailList'],
}))
@Form.create({ fieldNameProp: null })
export default class LineDetail extends Component {
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
    const { lineDetailDrawer, onLineDetailCancel, handleTableLineDetailChange, dataSource, pagination, fetchLoading } = this.props;

    const columns = [
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 170,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        align: 'center',
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 120,
        align: 'center',
      },
      {
        title: '上层容器',
        dataIndex: 'currentContainerCode',
        width: 120,
        align: 'center',
      },
      {
        title: '顶层容器',
        dataIndex: 'topContainerCode',
        width: 120,
        align: 'center',
      },
      {
        title: '执行数量',
        dataIndex: 'actualQty',
        width: 120,
        align: 'center',
      },
      {
        title: '执行时间',
        dataIndex: 'lastUpdateDate',
        width: 170,
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'lastUpdatedByName',
        width: 120,
        align: 'center',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1200}
        visible={lineDetailDrawer}
        onCancel={onLineDetailCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={fetchLoading}
          rowKey="detailId"
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => handleTableLineDetailChange(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
