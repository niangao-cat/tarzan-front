/*
 * @Description: 待上线数量（明细）
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-12-14 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ nonStandardProductReport, loading }) => ({
  nonStandardProductReport,
  fetchLoading: loading.effects['nonStandardProductReport/fetchmakeNumList'],
}))
@Form.create({ fieldNameProp: null })
export default class MakeNumDrawer extends Component {
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
    const { makeNumDrawer, onMakeNumCancel, onMakeNumSearch, dataSource, pagination, fetchLoading } = this.props;
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
        title: 'EO创建时间',
        dataIndex: 'creationDate',
      },
      {
        title: 'EO执行作业状态',
        dataIndex: 'eoStatus',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={makeNumDrawer}
        onCancel={onMakeNumCancel}
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
          onChange={page => onMakeNumSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
