/**
 * FilterForm - 搜索栏
 * @date: 2019-7-29
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.org.locatorGroup.model.locatorGroup';
const { Option } = Select;

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} locatorGroup - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ locatorGroup, loading }) => ({
  locatorGroup,
  tenantId: getCurrentOrganizationId(),
  fetchLocatorGroupLoadng: loading.effects['locatorGroup/fetchLocatorGroupList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.org.locatorGroup',
})
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  fetchQueryList = () => {
    const { form, onSearch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onSearch(fieldsValue);
      }
    });
  };

  /**
   * 查询按钮点击
   * @returns
   */
  queryValue = () => {
    this.fetchQueryList();
  };

  /**
   * 重置form表单
   */
  handleFormReset = () => {
    const { form, onResetSearch } = this.props;
    form.resetFields();
    onResetSearch();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { fetchLocatorGroupLoadng } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组编码')}
            >
              {getFieldDecorator('locatorGroupCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述')}
            >
              {getFieldDecorator('locatorGroupName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag')(
                <Select allowClear>
                  <Option value="Y">{intl.get(`${modelPrompt}.enable`).d('启用')}</Option>
                  <Option value="N">{intl.get(`${modelPrompt}.unable`).d('禁用')}</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={fetchLocatorGroupLoadng}
                onClick={this.queryValue}
              >
                {intl.get('tarzan.org.locatorGroup.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
