/*
 * FilterForm - 搜索框
 * date: 2020-01-03
 * author : 黄文钊 <wenzhao.huang@hand-china.com>
 * version : 0.0.1
 * copyright Copyright (c) 2020, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Select } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const { Option } = Select;

const modelPrompt = 'tarzan.hmes.businessType.model.businessType';

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
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ businessType, loading }) => ({
  businessType,
  fetchLoading: loading.effects['businessType/fetchBusinessTypeList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount() {
    this.props.onRefs(this);
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
          type: 'businessType/fetchBusinessTypeList',
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

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { getFieldDecorator } = this.props.form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.businessType`).d('业务类型')}
            >
              {getFieldDecorator('businessType')(
                <Lov code="MT.BUSINESS_TYPE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionType`).d('移动类型')}
            >
              {getFieldDecorator('instructionType')(
                <Lov code="MT.INSTRUCTION_TYPE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
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
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.org.businessType.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
