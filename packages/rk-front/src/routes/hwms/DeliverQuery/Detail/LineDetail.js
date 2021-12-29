/*
 * @Description: 已扫描条码明细
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-09-14 18:36:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  fetchLoading: loading.effects['deliverQuery/fetchLineDetailList'],
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
        width: 120,
        align: 'center',
      },
      {
        title: '条码数量',
        dataIndex: 'actualQty',
        width: 120,
        align: 'center',
      },
      {
        title: '条码状态',
        dataIndex: 'statusMeaning',
        width: 100,
        align: 'center',
      },
      {
        title: '接收时间',
        dataIndex: 'creationDate',
        width: 120,
        align: 'center',
      },
      {
        title: '接收人',
        dataIndex: 'createdByName',
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
          rowKey="actualDetailId"
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
