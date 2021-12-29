/**
 * FilterForm - 搜索框
 * @date: 2019-8-8
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.org.area.model.area';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
const { Option } = Select;

@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ area, loading }) => ({
  area,
  fetchMessageLoading: loading.effects['area/fetchQueryBomList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    expandForm: false,
  };

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
          type: 'area/fetchAreaList',
          payload: {
            ...fieldsValue,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 查询按钮点击
   * @returns
   */
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
    const { getFieldDecorator } = this.props.form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.areaCode`).d('区域编码')}
            >
              {getFieldDecorator('areaCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.areaName`).d('区域短描述')}
            >
              {getFieldDecorator('areaName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('区域长描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.area.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.area.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('hzero.common.button.search').d('查询')}
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
                  <Option key="Y" value="Y">
                    {intl.get(`${modelPrompt}.enable`).d('启用')}
                  </Option>
                  <Option key="N" value="N">
                    {intl.get(`${modelPrompt}.unable`).d('禁用')}
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
