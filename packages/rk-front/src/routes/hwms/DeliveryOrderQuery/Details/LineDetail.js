/*
 * @Description: 行明细
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-09-20 16:06:05
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  fetchLoading: loading.effects['deliveryOrderQuery/fetchLineDetailList'],
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
        title: '配送单号',
        dataIndex: 'instructionDocNum',
        width: 170,
        align: 'center',
      },
      {
        title: '配送单行号',
        dataIndex: 'instructionNum',
        width: 170,
        align: 'center',
      },
      {
        title: '物料批',
        dataIndex: 'materialLot',
        width: 170,
        align: 'center',
      },
      {
        title: '物料批状态',
        dataIndex: 'materialStatus',
        width: 120,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        align: 'center',
      },
      {
        title: '版本',
        dataIndex: 'materialVersion',
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
        title: '实际执行数量',
        dataIndex: 'primaryUomQty',
        width: 120,
        align: 'center',
      },
      {
        title: '批次',
        dataIndex: 'lot',
        width: 120,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 120,
        align: 'center',
      },
      {
        title: '物流器具',
        dataIndex: 'containerNum',
        width: 120,
        align: 'center',
      },
      {
        title: '现存货位',
        dataIndex: 'locatorCode',
        width: 120,
        align: 'center',
      },
      {
        title: '备料时间',
        dataIndex: 'createdDate',
        width: 170,
        align: 'center',
      },
      {
        title: '备料人',
        dataIndex: 'createdBy',
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
