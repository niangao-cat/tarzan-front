/**
 * FilterForm - 搜索栏
 * @date: 2019-12-11
 * @author: dong.li
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import { isFunction } from 'lodash';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} childSteps - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ childSteps, loading }) => ({
  childSteps,
  tenantId: getCurrentOrganizationId(),
  fetchLocatorGroupLoadng: loading.effects['childSteps/fetchLocatorGroupList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList() {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onSearch(fieldsValue);
      }
    });
  }

  @Bind()
  queryValue() {
    this.fetchQueryList();
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { qualityType, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='资质类型'
            >
              {getFieldDecorator('qualityType')(
                <Select allowClear style={{ width: '100%' }}>
                  {qualityType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='资质名称'
            >
              {getFieldDecorator('qualityName')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='启用状态'
            >
              {getFieldDecorator('enableFlag')(
                <Select allowClear style={{ width: '100%' }}>
                  <Select.Option key='Y' value='Y'>
                    启用
                  </Select.Option>
                  <Select.Option key='N' value='N'>
                    禁用
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.queryValue}
              >
                查询
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
