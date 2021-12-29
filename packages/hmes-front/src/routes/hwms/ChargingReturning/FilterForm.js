/**
 * 盘装料退料
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction, isEmpty } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
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
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'chargingReturning/updateState',
      payload: {
        parentInfo: {},
      },
    });
  }

  /**
   * 扫描条码
   */
  @Bind()
  handleScanCode(e) {
    const { onSearch } = this.props;
    if (!isEmpty(e.target.value)) {
      onSearch();
      const time = setTimeout(()=> {
        const barcode = document.getElementById('barcodeInput');
        barcode.focus();
        barcode.select();
        clearTimeout(time);
      }, 1500);
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt1 = 'hwms.chargingReturning.model.chargingReturning';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { form, typeMap, parentInfo } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt1}.returnType`).d('退料类型')}
            >
              {getFieldDecorator('returnType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt1}.returnType`).d('退料类型'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {typeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPromt2}.materialLotCode`).d('条码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode', {})(
                <Input onPressEnter={this.handleScanCode} id="barcodeInput" trim />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt1}.woNum`).d('工单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderNum', {
                initialValue: parentInfo.workOrderNum,
              })(<Input trim disabled />)}
            </Form.Item>
          </Col>
          {/* <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt1}.docNum`).d('产线')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {})(<Input trim disabled />)}
            </Form.Item>
          </Col> */}
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt1}.prodLineName`).d('产线描述')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('prodLineName', {
                initialValue: parentInfo.prodLineName,
              })(<Input trim disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
