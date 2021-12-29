import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
  FORM_COL_3_LAYOUT,
  FORM_COL_2_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Col, Row, Input, Button, DatePicker } from 'hzero-ui';
import moment from 'moment';

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

  @Bind()
  handleCompleteData(){
    const { handleCompleteData, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        handleCompleteData(values);
      }
    });
  }

  // 渲染
  render() {
    const { form, headData, num, completeLoading } = this.props;
    headData.remark = this.props.form.getFieldValue('remark');
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
                {getFieldDecorator('siteName', {
                  initialValue: headData.siteName,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="送货单号">
                {getFieldDecorator('deliveryNum', {
                  initialValue: num,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              {/* <Button
                type="primary"
                htmlType="submit"
                onClick={handlePrintData}
                style={{ marginLeft: '30px', marginTop: '5px' }}
              >
                {intl.get(`${modelPromt}.button.search`).d('打印')}
              </Button> */}
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleCompleteData}
                loading={completeLoading}
                style={{ marginLeft: '15px', marginTop: '5px' }}
              >
                {intl.get(`${modelPromt}.button.search`).d('完成')}
              </Button>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.deliveryStatus`).d('单据状态')}
              >
                {getFieldDecorator('deliveryStatus', {
                  initialValue: headData.deliveryStatusMeanning,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_2_LAYOUT} style={{ marginLeft: '-103px' }}>
              <Form.Item
                label={intl.get(`${modelPromt}.address`).d('收货地址')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('address', {
                  initialValue: headData.address,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.supplierCode`).d('供应商编码')}
              >
                {getFieldDecorator('supplierCode', {
                  initialValue: headData.supplierCode,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.supplierCode`).d('供应商描述')}
              >
                {getFieldDecorator('supplierName', {
                  initialValue: headData.supplierName,
                })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item label="到货时间" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('receviceDate', {
                  initialValue: headData.receviceDate ? moment(headData.receviceDate) : '',
                })(<DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_2_LAYOUT} style={{ marginLeft: '-103px' }}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="备注">
                {getFieldDecorator('remark', {})(<Input trim />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
