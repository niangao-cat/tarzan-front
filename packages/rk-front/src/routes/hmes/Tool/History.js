/*
 * @Description: 工装修改历史记录
 * @version: 0.1.0
 * @Author: li.zhang13@hand-china.com
 * @Date: 2021-01-08 15:46:42
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ tool, loading }) => ({
  tool,
  fetchLoading: loading.effects['tool/handhistory'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryDetail extends Component {
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
    const { historyDetailDrawer, onHistoryDetailCancel, handleHistoryDetailChange, dataSource, pagination, fetchLoading } = this.props;

    const columns = [
        {
            title: '工具名称',
            dataIndex: 'toolName',
            width: 150,
        },
        {
            title: '品牌',
            dataIndex: 'brandName',
            width: 150,
        },
        {
            title: '规格型号',
            dataIndex: 'specification',
            width: 150,
        },
        {
            title: '单位',
            dataIndex: 'uomName',
            width: 150,
        },
        {
            title: '数量',
            dataIndex: 'qty',
            width: 150,
        },
        {
            title: '使用频率',
            dataIndex: 'rate',
            width: 150,
        },
        {
            title: '是否有效',
            dataIndex: 'enableFlag',
            width: 150,
        },
        {
            title: '更新人',
            dataIndex: 'name',
            width: 150,
        },
        {
            title: '更新时间',
            dataIndex: 'lastUpdateDate',
            width: 150,
        },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1200}
        visible={historyDetailDrawer}
        onCancel={onHistoryDetailCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={fetchLoading}
          rowKey="toolHisId"
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => handleHistoryDetailChange(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
