/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-03-22 12:36:03
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
@connect(({ purchaseReturn, purchaseOrder, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseReturn,
  purchaseOrder,
  loading: {
    detailLoading: loading.effects['purchaseReturn/queryLineDetailList'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class Skip extends Component {
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
    const { skipFlag, handleOk, handleCancel } = this.props;

    return (
      <Modal
        destroyOnClose
        title={intl.get('22').d('是否跳转送货单查询界面？')}
        width={400}
        visible={skipFlag}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    );
  }
}
