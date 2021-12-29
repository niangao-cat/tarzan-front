/**
 * FilterForm - 搜索框
 * @date: 2019-12-3
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Select } from 'hzero-ui';
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
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';

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
  state = {
    orgType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'working/fetchOrgTypeList',
      payload: {
        module: 'CALENDAR',
        typeGroup: 'CALENDAR_ORGANIZATION',
      },
    });
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList() {
    const {
      form,
      dispatch,
      working: { calendarOrgPagination = {} },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'working/fetchCalendarOrgList',
          payload: {
            ...fieldsValue,
            page: { ...calendarOrgPagination },
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
    this.setState({
      orgType: '',
    });
  }

  /**
   * 组织类型切换
   */
  @Bind()
  changeType(value) {
    this.setState({
      orgType: value,
    });
    this.props.form.resetFields(['calendarOrganizationId']);
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      working: { orgTypeList = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const { orgType } = this.state;
    const tenantId = getCurrentOrganizationId();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationType`).d('组织类型')}
            >
              {getFieldDecorator('organizationType')(
                <Select style={{ width: '100%' }} allowClear onChange={this.changeType}>
                  {(orgTypeList || []).map(item => {
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
              label={intl.get(`${modelPrompt}.calendarOrganizationId`).d('组织编码')}
            >
              {getFieldDecorator('calendarOrganizationId')(
                <Lov
                  code="MT_USER_ORGANIZATION"
                  queryParams={{ tenantId, organizationType: orgType }}
                  disabled={orgType === ''}
                />
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
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.calendar.working.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
