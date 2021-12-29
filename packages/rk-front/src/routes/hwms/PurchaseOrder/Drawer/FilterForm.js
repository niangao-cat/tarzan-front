import React from 'react';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Col, Row, Input } from 'hzero-ui';
// import { getDateFormat, getCurrentOrganizationId } from 'utils/utils';

// model 层连接
@formatterCollections({ code: 'tarzan.hmes.purchaseOrder' })
@connect(purchaseOrder => ({
  purchaseOrder,
}))
// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  // 初始化状态
  state = {
    // eslint-disable-next-line react/no-unused-state
    expandForm: false,
  };

  // 渲染
  render() {
    const { form } = this.props;
    const modelPromt = 'tarzan.hmes.purchaseOrder';
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.plantCode`).d('工厂')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.instructionNum`).d('采购订单')}
              >
                {getFieldDecorator('status', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="送货单号">
                {getFieldDecorator('siteId', {})(<Input trim />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.supplierCode`).d('供应商编码')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.supplierName`).d('供应商描述')}
              >
                {getFieldDecorator('status', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="送货单状态">
                {getFieldDecorator('siteId', {})(<Input trim />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label="到货时间" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="送货地址">
                {getFieldDecorator('status', {})(<Input trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="备注">
                {getFieldDecorator('siteId', {})(<Input trim />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
