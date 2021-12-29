/*
 * @Description: 产量抽屉
 * @version: 0.1.0
 * @Author: xinyu.wang02@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2020-06-12 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, Table, Row, Col, Button, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
@Form.create({ fieldNameProp: null })
export default class MakeNumDrawer extends Component {

  @Bind()
  handleSearch(page = {}) {
    const { onMakeNumSearch, form: { getFieldsValue } } = this.props;
    if (onMakeNumSearch) {
      onMakeNumSearch(page, getFieldsValue());
    }
  }

  // 重置查询
  @Bind()
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      makeNumDrawer,
      onMakeNumCancel,
      dataSource,
      pagination,
      detailLoading,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: 'WO编码',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: 'EO编码',
        dataIndex: 'eoNum',
      },
      {
        title: 'EO标识',
        dataIndex: 'identification',
      },
      {
        title: '数量',
        dataIndex: 'qty',
      },
      {
        title: '进站时间',
        dataIndex: 'siteInDate',
      },
      {
        title: '出站时间',
        dataIndex: 'siteOutDate',
      },
      {
        title: '加工时长',
        dataIndex: 'processTime',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={makeNumDrawer}
        onCancel={onMakeNumCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label="WO编码"
              >
                {getFieldDecorator('workOrderNum')(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label="EO编码"
              >
                {getFieldDecorator('eoNum')(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="EO标识">
                {getFieldDecorator('identification')(<Input />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
              <Form.Item>
                <Button onClick={this.resetSearch}>
                  {intl.get(`hzero.common.button.reset`).d('重置')}
                </Button>
                <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                  {intl.get(`hzero.common.button.search`).d('查询')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          loading={detailLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={this.handleSearch}
          bordered
        />
      </Modal>
    );
  }
}
