/**
 * FilterForm - 搜索框
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.process.technology.model.technology';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} workCellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ technology }) => ({
  technology,
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.process.technology',
})
export default class FilterForm extends React.Component {
  state = {
    expandForm: false,
    siteCode: "",
  };

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList() {
    const { form, onSearch} = this.props;
    const { siteCode } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const fieldsValues = {
          siteCode,
          ...fieldsValue,
        };
        onSearch(fieldsValues);
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
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    // const { form } = this.props;
    this.setState({ expandForm: !expandForm });
    // form.resetFields(['enableFlag', 'prodLineType']);
  }

  // 所属站点lov值改变事件
  @Bind()
  changeSiteLov(vals, records){
    this.setState({siteCode: records.siteCode});
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      technology: { typeList = [] },
      search,
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteName`).d('所属站点')}
            >
              {getFieldDecorator('siteId', {initialValue: search.siteId})(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId, siteType: 'MANUFACTURING' }}
                  textValue={search.siteCode}
                  onChange={(vals, records) => this.changeSiteLov(vals, records)}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.operationName`).d('工艺编码')}
            >
              {getFieldDecorator('operationName', {initialValue: search.operationName})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.operationDesc`).d('工艺描述')}
            >
              {getFieldDecorator('operationDesc', {initialValue: search.operationDesc})(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
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
              label={intl.get(`${modelPrompt}.operationType`).d('工艺类型')}
            >
              {getFieldDecorator('operationType', {initialValue: search.operationType})(
                <Select style={{ width: '100%' }}>
                  {typeList.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.revision`).d('版本')}
            >
              {getFieldDecorator('revision', {initialValue: search.revision})(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
