/*
 * @Description: 巡检单行明细
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-07 11:02:39
 */
import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  fetchLineDetailLoading: loading.effects['pqcDocQuery/queryLineDetailList'],
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
    const { lineDetailDrawer, onLineDetailCancel, handleTableLineDetailChange, dataSource, pagination, fetchLineDetailLoading } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        width: 170,
        align: 'center',
      },
      {
        title: '结果',
        dataIndex: 'result',
        width: 170,
        align: 'center',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 170,
        align: 'center',
      },
    ];

    return (
      <Modal
        title='巡检单行明细'
        confirmLoading={false}
        width={800}
        visible={lineDetailDrawer}
        onCancel={onLineDetailCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={fetchLineDetailLoading}
          rowKey="pqcLineId"
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
