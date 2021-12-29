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
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
// import notification from 'utils/notification';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import cacheComponent from 'components/CacheComponent';

const modelPrompt = 'tarzan.product.produce.model.produce';

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
  loading: loading.effects['produce/fetchProduceList'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.product.produce',
})
@cacheComponent({ cacheKey: '/product/produce/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {};
  }

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
   * 渲染方法
   * @returns
   */
  render() {
    const { form, loading } = this.props;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    // const { expandForm, proLineType } = this.state;
    const {
      materialCode = '',
      categoryCode = '',
    } = this.props.form.getFieldsValue();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      materialCode: item.materialCode,
                    });
                  }}
                  textValue={materialCode}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('materialCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.categoryCode`).d('物料类别')}
            >
              {getFieldDecorator('materialCategoryId')(
                <Lov
                  code="MT.MATERIAL_CATEGORY"
                  queryParams={{ tenantId }}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      categoryCode: item.categoryCode,
                    });
                  }}
                  textValue={categoryCode}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('categoryCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button type="primary" htmlType="submit" loading={loading} onClick={this.queryValue}>
                {intl.get('tarzan.product.produce.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
