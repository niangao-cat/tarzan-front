/**
 * FilterForm - 搜索框
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
// import {isUndefined} from 'lodash';
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

const modelPrompt = 'tarzan.calendar.working.model.working';

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
 * @reactProps {Object} siteList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ working }) => ({
  working,
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/fetchWorkingList',
          payload: {
            ...fieldsValue,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

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
      working: { calendarTypeList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.calendarCode`).d('日历编码')}
            >
              {getFieldDecorator('calendarCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.calendarType`).d('日历类型')}
            >
              {getFieldDecorator('calendarType')(
                <Select style={{ width: '100%' }} allowClear>
                  {(calendarTypeList || []).map(item => {
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
              label={intl.get(`${modelPrompt}.description`).d('日历描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.calendar.working.button.collected').d('收起查询')
                  : intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.calendar.working.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag')(
                <Select style={{ width: '100%' }} allowClear>
                  <Select.Option value="Y">
                    {intl.get(`${modelPrompt}.enable`).d('启用')}
                  </Select.Option>
                  <Select.Option value="N">
                    {intl.get(`${modelPrompt}.unable`).d('禁用')}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
