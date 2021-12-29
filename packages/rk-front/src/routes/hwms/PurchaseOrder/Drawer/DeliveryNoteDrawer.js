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
import { Modal, Form, Input } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import FilterForm from './FilterForm';

@connect(({ purchaseReturn, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  purchaseReturn,
  loading: {
    detailLoading: loading.effects['purchaseReturn/queryLineDetailList'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const columns = [
      {
        title: '送货单行号',
        dataIndex: 'workOrderCompleted',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'workOrderCompleted',
        width: 100,
      },
      {
        title: '物料描述',
        dataIndex: 'workOrderCompleted',
        width: 100,
      },
      {
        title: '制单数量',
        dataIndex: `Am`,
        render: (value, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('a', {
              initialValue: value,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>
        ),
      },
      {
        title: '单位',
        dataIndex: 'workOrderCompleted',
        width: 100,
      },
      {
        title: '送货单运行状态',
        dataIndex: 'workOrderCompleted',
        width: 100,
      },
      {
        title: '废料调换数量',
        dataIndex: `Am`,
        render: (value, record) => (
          <Form.Item>
            {record.$form.getFieldDecorator('a', {
              initialValue: value,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>
        ),
      },
    ];
    const { showDrawer, onCancel } = this.props;
    const dataSource = [
      {
        workOrderCompleted: 1,
        _status: 'update',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={850}
        title="创建送货信息"
        visible={showDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        onOk={this.handleOK}
      >
        <FilterForm />
        <EditTable
          // loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          // scroll={{ x: 1600 }}
          // rowKey="id"
          bordered
        />
      </Modal>
    );
  }
}
