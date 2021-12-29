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
@connect(({ productPassThroughRateReport, loading }) => ({
  productPassThroughRateReport,
  detailLoading: loading.effects['productPassThroughRateReport/fetchDetailList'],
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
    const { expandDrawer, onCancel, detailList } = this.props;
    const columns = [
      {
        title: '条码',
        dataIndex: 'code',
        width: 150,
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={500}
        visible={expandDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          dataSource={detailList}
          columns={columns}
        />
      </Modal>
    );
  }
}
