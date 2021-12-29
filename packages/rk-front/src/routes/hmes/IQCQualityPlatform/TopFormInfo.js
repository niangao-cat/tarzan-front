/*
 * @Description: IQC检验顶部form信息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-20 10:45:01
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-20 15:40:56
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'hzero-ui';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT } from 'utils/constants';
import styles from './index.less';

const FORM_COL_5_LAYOUT = {
  span: 5,
  style: { width: '20%' },
};
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
@Form.create({ fieldNameProp: null })
export default class TopFormInfo extends Component {
  /**
   * render
   * @returns React.element
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles['top-form-info']}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="接收批次" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>2020012120</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="接收人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<span>李现</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验来源" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<span>送货单</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<span>DZ000001</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="供应商" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workOrderNum', {})(<span>昆山xxx电子厂-NK3R</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="来源单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>DN2012031923</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="物料描述" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>电子芯片BISD-EQZ</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="建单日期" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>2012-12-12 19:43</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="物料数量" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>200</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="单位" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>件</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验方式" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>正常</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验开始" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>2020-01-19 01:19</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="标准剩余时长" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>120h</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="加急标示" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>加急</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="完成时间" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>2020-02-01 09:21</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>首次送检</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>新建</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT} style={{ width: '50%' }}>
            <Form.Item label="备注" {...formLayout}>
              {getFieldDecorator('workshop', {})(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="检验结果" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>合格</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="合格项数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>50</span>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_5_LAYOUT}>
            <Form.Item label="不良项数" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workshop', {})(<span>0</span>)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
