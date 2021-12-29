import React, { Component } from 'react';
import { Form, Row, Col, Input, Icon } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
class DoAllEditor extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }


  @Bind()
  onEnterDownSoNum(e) {
    const { form, updateSoNum } = this.props;
    if (e.keyCode === 13) {
      updateSoNum(form.getFieldValue('transferSoNum'));
      form.setFieldsValue({ 'transferSoNum': '' });
    }
  }

  @Bind()
  onEnterDownSoLineNum(e) {
    const { form, updateSoLineNum } = this.props;
    if (e.keyCode === 13) {
      updateSoLineNum(form.getFieldValue('transferSoLineNum'));
      form.setFieldsValue({ 'transferSoLineNum': '' });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, doAllVisible } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: doAllVisible ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='目标销售订单号'>
              {getFieldDecorator('transferSoNum', {
              })(
                <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDownSoNum} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='目标销售订单行号'>
              {getFieldDecorator('transferSoLineNum', {
              })(
                <Input suffix={<Icon type="enter" />} onKeyDown={this.onEnterDownSoLineNum} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default DoAllEditor;
