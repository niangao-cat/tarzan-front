/*
 * @Description: 在线数量（明细）
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
  fetchLoading: loading.effects['nonStandardProductReport/fetchdefectsNumbList'],
}))
@Form.create({ fieldNameProp: null })
export default class DefectsNumbDrawer extends Component {
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
    const { defectsNumbDrawer, onDefectsNumbCancel, onDefectsNumbSearch, dataSource, pagination, fetchLoading } = this.props;
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
        title: '当前工序',
        dataIndex: 'processName',
      },
      {
        title: '当前工序滞留时间',
        dataIndex: 'delayTime',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={defectsNumbDrawer}
        onCancel={onDefectsNumbCancel}
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
          onChange={page => onDefectsNumbSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
