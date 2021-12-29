/**
 * FilterForm - 搜索框
 * @date: 2019-8-16
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';

import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.org.dataItem.model.dataItem';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} locatorList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ dataItem, loading }) => ({
  dataItem,
  fetchMessageLoading: loading.effects['dataItem/fetchLocatorList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  state = {
    expandForm: false,
  };

  @Bind()
  fetchQueryList = () => {
    const { onSearch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  };

  @Bind()
  handleFormReset = () => {
    const { handleFormReset, form } = this.props;
    form.resetFields();
    handleFormReset();
  };

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      search,
      // handleFormReset,
      dataItem: { valueTypeList = [], collectionMthodList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('数据项编码')}
            >
              {getFieldDecorator('tagCode', {initialValue: search.tagCode})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorName`).d('数据项描述')}
            >
              {getFieldDecorator('tagDescription', {initialValue: search.tagDescription})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorType`).d('数据类型')}
            >
              {getFieldDecorator('valueType', {initialValue: search.valueType})(
                <Select style={{ width: '100%' }} allowClear>
                  {valueTypeList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.dataItem.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.dataItem.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.org.dataItem.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCategory`).d('数据收集方式')}
            >
              {getFieldDecorator('collectionMethod', {initialValue: search.collectionMethod})(
                <Select style={{ width: '100%' }} allowClear>
                  {collectionMthodList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupCode`).d('允许缺失值')}
            >
              {getFieldDecorator('valueAllowMissing', {initialValue: search.valueAllowMissing})(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option value="Y">启用</Select.Option>
                  <Select.Option value="N">禁用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorLocation`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {initialValue: search.enableFlag})(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option value="Y">启用</Select.Option>
                  <Select.Option value="N">禁用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
