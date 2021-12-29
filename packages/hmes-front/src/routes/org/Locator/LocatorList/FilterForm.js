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
// import {isUndefined} from 'lodash';
import Lov from 'components/Lov';
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
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.org.locator.model.locator';

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
@connect(({ locator, loading }) => ({
  locator,
  fetchMessageLoading: loading.effects['locator/fetchLocatorList'],
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
          type: 'locator/fetchLocatorList',
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

  @Bind
  setLocatorGroupName(val, record) {
    this.props.form.setFieldsValue({ locatorGroupId: record.locatorGroupId });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      locator: { locatorTypeList = [], locatorCategoryList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCode`).d('库位编码')}
            >
              {getFieldDecorator('locatorCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorName`).d('库位描述')}
            >
              {getFieldDecorator('locatorName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorType`).d('库位类型')}
            >
              {getFieldDecorator('locatorType')(
                <Select style={{ width: '100%' }} allowClear>
                  {locatorTypeList instanceof Array &&
                    locatorTypeList.length !== 0 &&
                    locatorTypeList.map(item => {
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
                  ? intl.get('tarzan.org.locator.button.collected').d('收起查询')
                  : intl.get(`tarzan.org.locator.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.org.locator.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorCategory`).d('库位类别')}
            >
              {getFieldDecorator('locatorCategory')(
                <Select style={{ width: '100%' }} allowClear>
                  {locatorCategoryList instanceof Array &&
                    locatorCategoryList.length !== 0 &&
                    locatorCategoryList.map(item => {
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
              label={intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组')}
            >
              {getFieldDecorator('locatorGroupCode')(
                <Lov
                  onChange={this.setLocatorGroupName}
                  queryParams={{ tenantId }}
                  code="MT.MOD_LOCATOR_GROUP"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} style={{ display: 'none' }}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('locatorGroupId')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorLocation`).d('库位位置')}
            >
              {getFieldDecorator('locatorLocation')(<Input />)}
            </Form.Item>
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
