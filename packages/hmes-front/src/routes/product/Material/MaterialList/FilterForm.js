/**
 * FilterForm - 搜索框
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import Lov from 'components/Lov';
// import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
import cacheComponent from 'components/CacheComponent';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.product.materialManager.model.materialManager';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} workCellList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ loading }) => ({
  loading: loading.effects['materialManager/fetchMaterialList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.product.materialManager',
})
@cacheComponent({ cacheKey: '/product/material-manager/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRefs(this);
  }

  state = {
    expandForm: false,
  };

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

  @Bind
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  @Bind()
  handleFormReset = () => {
    const { form, resetSearch } = this.props;
    form.resetFields();
    resetSearch();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    // const tenantId = getCurrentOrganizationId();
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialCode')(
                // <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
            >
              {getFieldDecorator('materialName')(
                // <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialIdentifyCode`).d('物料简码')}
            >
              {getFieldDecorator('materialIdentifyCode')(
                // <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.product.materialManager.button.collected').d('收起查询')
                  : intl.get(`tarzan.product.materialManager.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('tarzan.product.materialManager.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.product.materialManager.button.search').d('查询')}
              </Button>
            </FormItem>
            {/* <FormItem>
              <Button type="primary" htmlType="submit" loading={loading} onClick={this.queryValue}>
                {intl.get('tarzan.product.materialManager.button.search').d('查询')}
              </Button>
            </FormItem> */}
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialDesignCode`).d('物料图号')}
            >
              {getFieldDecorator('materialDesignCode')(
                // <Lov code="MT.MATERIAL" queryParams={{ tenantId }} />
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
