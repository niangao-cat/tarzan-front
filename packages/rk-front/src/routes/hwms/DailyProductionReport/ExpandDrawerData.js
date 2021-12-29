/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-12 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
@connect(({ inProcessQueryReport, loading }) => ({
  inProcessQueryReport,
  detailLoading: loading.effects['dailyProductionReport/queryDetailDataAllList'],
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
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
    const { expandDrawer, onCancel, onSearch, detailList, detailPagination, detailLoading } = this.props;
    const columns = [
      {
        title: 'eo编码',
        dataIndex: 'eoNum',
        width: 150,
      },
      {
        title: 'wo编码',
        dataIndex: 'workOrderNum',
      },
      {
        title: 'eo标识',
        dataIndex: 'eoIdentification',
      },
      {
        title: '返修标识',
        dataIndex: 'validateFlag',
        render: val =>
        (
           [{ typeCode: 'Y', description: '是' }, { typeCode: 'N', description: '否' }].filter(
             ele => ele.typeCode === val
           )[0] || {}
         ).description,
      },
      {
        title: '操作时间',
        dataIndex: 'lastUpdateDate',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={expandDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={detailLoading}
          rowKey="instructionId"
          dataSource={detailList}
          columns={columns}
          pagination={detailPagination}
          onChange={page => onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
