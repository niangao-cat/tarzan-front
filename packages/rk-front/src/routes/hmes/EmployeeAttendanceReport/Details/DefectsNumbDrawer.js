/*
 * @Description: 不良数抽屉
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-06-12 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import { isArray } from 'lodash';
import EditTable from 'components/EditTable';
@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  fetchLoading: loading.effects['employeeAttendanceReport/fetchDefectsNumbList'],
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
    const { defectsNumbDrawer, onDefectsNumbCancel, onDefectsNumbSearch, dataSource, pagination, loading } = this.props;
    const columns = [
      {
        title: 'EO编码',
        dataIndex: 'eoNum',
        width: 150,
      },
      {
        title: '条码号',
        dataIndex: 'materialLotCode',
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
      },
      {
        title: '不良申请单号',
        dataIndex: 'incidentNumber',
      },
      {
        title: '提交时间',
        dataIndex: 'dateTime',
      },
      {
        title: '提交人',
        dataIndex: 'userName',
      },
      {
        title: '不良代码组',
        dataIndex: 'description',
      },
      {
        title: '不良代码',
        dataIndex: 'ncCodeDescriptionList',
        render: (val, record)=>{
          if(isArray(record.ncCodeDescriptionList) && record.ncCodeDescriptionList.length > 0){
            return record.ncCodeDescriptionList.join(',');
          }else{
            return "";
          }
        },
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
          loading={loading}
          rowKey="ncRecordId"
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
