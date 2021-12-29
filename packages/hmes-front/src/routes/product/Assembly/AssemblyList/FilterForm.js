/**
 * FilterForm - 装配清单搜索框
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.2
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

const modelPrompt = 'tarzan.product.bom.model.bom';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} assemblyList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  fetchMessageLoading: loading.effects['assemblyList/fetchQueryBomList'],
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

  componentDidMount() {
    const {
      form,
      assemblyList: { queryFormFieldsValue = {} },
    } = this.props;
    form.setFieldsValue(queryFormFieldsValue);
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
          type: 'assemblyList/fetchQueryBomList',
          payload: {
            ...fieldsValue,
            page: pagination,
          },
        });
        dispatch({
          type: 'assemblyList/updateState',
          payload: {
            queryFormFieldsValue: { ...fieldsValue },
            queryFormPagination: pagination,
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

  // 查询条件展开/收起，同时去查询类型，描述
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    const { dispatch } = this.props;
    if (!expandForm) {
      // 查询select状态和类型
      dispatch({
        type: 'assemblyList/fetchAssemblyTypes',
        payload: {
          module: 'BOM',
          typeGroup: 'BOM_TYPE',
        },
      });
      dispatch({
        type: 'assemblyList/fetchAssemblyStatus',
        payload: {
          module: 'BOM',
          statusGroup: 'BOM_STATUS',
        },
      });
    }
    this.setState({ expandForm: !expandForm });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      assemblyList: { bomStatusList = [], bomTypesList = [] },
    } = this.props;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.bomName`).d('编码')}
            >
              {getFieldDecorator('bomName')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.description`).d('描述')}
            >
              {getFieldDecorator('description')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.revision`).d('版本')}
            >
              {getFieldDecorator('revision')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get(`${modelPrompt}.collected`).d('收起查询')
                  : intl.get(`${modelPrompt}.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get(`${modelPrompt}.reset`).d('重置')}
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
              label={intl.get(`${modelPrompt}.bomType`).d('类型')}
            >
              {getFieldDecorator('bomType')(
                <Select allowClear style={{ width: '100%' }}>
                  {bomTypesList.map(item => (
                    <Select.Option key={item.typeCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.bomStatus`).d('状态')}
            >
              {getFieldDecorator('bomStatus')(
                <Select allowClear style={{ width: '100%' }}>
                  {bomStatusList.map(item => (
                    <Select.Option key={item.statusCode}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
