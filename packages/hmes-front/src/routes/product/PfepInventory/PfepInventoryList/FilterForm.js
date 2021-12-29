/**
 * FilterForm - 搜索框
 * @date: 2019-8-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col } from 'hzero-ui';
// import { isUndefined } from 'lodash';
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
const modelPrompt = 'tarzan.product.inv.model.inv';

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} pfepInventoryList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ pfepInventory }) => ({
  pfepInventory,
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
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
          type: 'pfepInventory/fetchPfepInventoryList',
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
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.categoryCode`).d('物料类别')}
            >
              {getFieldDecorator('categoryId')(
                <Lov queryParams={{ tenantId }} code="MT.MATERIAL_CATEGORY" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.product.inv.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
