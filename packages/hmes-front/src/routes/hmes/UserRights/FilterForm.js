/**
 * FilterForm - 搜索栏
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Select, Row, Col, Input } from 'hzero-ui';
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

const modelPrompt = 'tarzan.mes.userRights.model.userRights';

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
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ userRights, loading }) => ({
  userRights,
  fetchMessageLoading: loading.effects['userRights/fetchUserRightsList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      queryDetailsVisible: false,
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
          type: 'userRights/fetchUserRightsList',
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
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      userRights: { organizationTypeList = [] },
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.userName`).d('员工账号')}
            >
              {getFieldDecorator('userName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.userDesc`).d('员工姓名')}
            >
              {getFieldDecorator('userDesc')(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationType`).d('组织层级')}
            >
              {getFieldDecorator('organizationType')(
                <Select style={{ width: '100%' }} allowClear>
                  {organizationTypeList instanceof Array &&
                    organizationTypeList.length !== 0 &&
                    organizationTypeList.map(item => {
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
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {this.state.queryDetailsVisible
                  ? intl.get('tarzan.mes.userRights.button.retractSearch').d('收起查询')
                  : intl.get('tarzan.mes.userRights.button.moreSearch').d('更多查询')}
                {/* {intl.get('hzero.common.button.moreSearch').d('更多查询')} */}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.mes.userRights.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationCode`).d('组织对象')}
            >
              {getFieldDecorator('organizationCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationDesc`).d('组织描述')}
            >
              {getFieldDecorator('organizationDesc')(<Input style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
