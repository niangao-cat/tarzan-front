/*
 * @Description: 明细
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-13 16:30:50
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-14 12:27:27
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Table, Form, Input, Row, Col, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import {
  FORM_COL_2_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
} from 'utils/constants';

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

  @Bind()
  onCancel(flag) {
    const { onCancel } = this.props;
    onCancel(flag);
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { showVisible, onCancel, detail = {} } = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const columns = [
      {
        title: '序号',
        width: 60,
        align: 'center',
        dataIndex: 'orderSeq',
        render: (text, record, index) => (
          <span>{(this.state.currentIndex - 1) * 10 + (index + 1)}</span>
        ),
      },
      {
        title: '外籍条码',
        width: 90,
        align: 'center',
        dataIndex: 'out',
      },
      {
        title: '是否混装',
        width: 90,
        align: 'center',
        dataIndex: 'hunzhuang',
      },
      {
        title: '物料数/总数',
        width: 110,
        align: 'center',
        dataIndex: 'zs',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={600}
        title={
          <span>
            <Button
              size="small"
              style={{ marginLeft: '10px' }}
              onClick={() => this.onCancel(false)}
            >
              &lt;&lt;收起
            </Button>
          </span>
        }
        onCancel={() => onCancel(false)}
        visible={showVisible}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料编码">
                {getFieldDecorator('materialCode', {
                  initialValue: detail.materialCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="物料描述">
                {getFieldDecorator('materialName', {
                  initialValue: detail.materialName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table bordered rowKey="id" columns={columns} />
      </Modal>
    );
  }
}
