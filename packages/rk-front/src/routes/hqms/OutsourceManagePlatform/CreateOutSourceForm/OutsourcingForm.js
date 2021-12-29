// 退料单创建
import React from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import {
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
export default class OutsourcingForm extends React.Component {

  // 查询方法
  @Bind
  handleCompleteData = () => {
    const { form, handleCompleteData } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        handleCompleteData(values);
      }
    });
  };

  // 渲染
  render() {
    const { form,
      outSourceHeadData = {},
      completeLoading,
    } = this.props;

    const modelPromt = 'tarzan.hmes.purchaseOrder';
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.number`).d('单号')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('number', {
                    initialValue: outSourceHeadData.number,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="供应商">
                {getFieldDecorator('supplierName', {
                    initialValue: outSourceHeadData.supplierName,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="单据类型">
                {getFieldDecorator('typeMeaning', {
                    initialValue: outSourceHeadData.typeMeaning,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
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
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.siteName`).d('工厂')}
              >
                {getFieldDecorator('siteName', {
                    initialValue: outSourceHeadData.siteName,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.stateMeaning`).d('单据状态')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('stateMeaning', {
                    initialValue: outSourceHeadData.stateMeaning,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label={intl.get(`${modelPromt}.earilyDemandTime`).d('发货时间')}
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('earilyDemandTime', {
                  initialValue: moment(moment().format('YYYY-MM-DD HH:mm:ss')),
                })(<DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.userName`).d('创建人')}
              >
                {getFieldDecorator('userName', {
                    initialValue: outSourceHeadData.userName,
                  })(<Input disabled trim />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...SEARCH_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPromt}.remark`).d('备注')}
              >
                {getFieldDecorator('remark', {
                    initialValue: outSourceHeadData.remark,
                  })(<Input trim />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
