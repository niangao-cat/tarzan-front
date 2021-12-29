/**
 *锁定对象解锁查询
 *@date：2019/9/22
 *@author：xinyu.wang <xinyu.wang02@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null }) // 创建一个表单对象
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this); // 子组件form对象传到父组件对象中
    }
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        onSearch();
      }
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.lockObjectUnlock.model.lockObjectUnlock';
    const { form, lockObjectTypeList } = this.props;
    const { getFieldDecorator} = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.objectType`).d('锁定对象')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('objectType', {})(
                <Select allowClear>
                  {lockObjectTypeList.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.objectRecordCode`).d('锁定对象编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('objectRecordCode', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
