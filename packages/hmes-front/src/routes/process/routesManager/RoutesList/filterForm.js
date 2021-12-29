/**
 * FilterForm - 搜索栏
 * @date: 2019-7-29
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_3_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.org.routes.model.routes';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} routes - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ routes, loading }) => ({
  routes,
  tenantId: getCurrentOrganizationId(),
  routesLoading: loading.effects['routes/fetchRouteList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.routes',
})
export default class FilterForm extends React.Component {
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
    const { form, onResetSearch } = this.props;
    form.resetFields();
    onResetSearch();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { routesLoading, form, search } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.substepName`).d('工艺路线编码')}
            >
              {getFieldDecorator('routerName', {initialValue: search.routerName})(<Input inputChinese={false} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupName`).d('工艺路线描述')}
            >
              {getFieldDecorator('description', {initialValue: search.description})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_3_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={routesLoading}
                onClick={this.queryValue}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
