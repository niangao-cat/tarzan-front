import React, { PureComponent } from 'react';
import { Form, Row, Col } from 'hzero-ui';

import { FORM_COL_4_LAYOUT } from 'utils/constants';

import styles from './index.less';

export default class BaseInfo extends PureComponent {

  render() {
    const { baseInfo = {}, workcellInfo={} } = this.props;
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18},
    };
    return (
      <Form className={styles['serviceSplitPlatform_form-fields']}>
        <Row gutter={48}>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="产品编码"
              {...formLayout}
            >
              {baseInfo.materialCode}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="产品描述"
              {...formLayout}
            >
              {baseInfo.materialName}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="物流公司"
              {...formLayout}
            >
              {baseInfo.logisticsCompanyMeaning}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="物流单号"
              {...formLayout}
            >
              {baseInfo.logisticsNumber}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48}>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="返回时间"
              {...formLayout}
            >
              {baseInfo.backDate}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="签收人"
              {...formLayout}
            >
              {baseInfo.signForByName}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="拆箱时间"
              {...formLayout}
            >
              {baseInfo.receiveDate}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="拆箱人"
              {...formLayout}
            >
              {baseInfo.receiveByName}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={48}>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="返回属性"
              {...formLayout}
            >
              {baseInfo.backTypeMeaning}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="工单号"
              {...formLayout}
            >
              {baseInfo.workOrderNum}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ paddingLeft: 24, paddingRight: 0}}>
            <Form.Item
              label="当前工位"
              {...formLayout}
            >
              {workcellInfo.workcellName}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
