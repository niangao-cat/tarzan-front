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
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
// import {isUndefined} from 'lodash';

import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
// import notification from 'utils/notification';
import cacheComponent from 'components/CacheComponent';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';

const modelPrompt = 'tarzan.org.collection.model.collection';
const tenantId = getCurrentOrganizationId();

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
@connect(({ collection, loading }) => ({
  collection,
  fetchMessageLoading: loading.effects['collection/fetchTagList'],
}))
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hmes/acquisition/data-collection/list' })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  @Bind()
  fetchQueryList = () => {
    const { onSearch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  };

  @Bind()
  handleFormReset = () => {
    const { handleFormReset, form } = this.props;
    form.resetFields();
    handleFormReset();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      form,
      // handleFormReset,
      collection: { statusList = [] },
      expandForm,
      changeExpandForm,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      operationName = '',
      materialCode = '',
    } = this.props.form.getFieldsValue();
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.tagGroupCode`).d('收集组编码')}
            >
              {getFieldDecorator('tagGroupCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.tagGroupDescription`).d('收集组描述')}
            >
              {getFieldDecorator('tagGroupDescription')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.status`).d('状态')}
            >
              {getFieldDecorator('status')(
                <Select style={{ width: '100%' }} allowClear>
                  {statusList.map(item => {
                    return (
                      <Select.Option value={item.statusCode} key={item.statusCode}>
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
              <Button onClick={changeExpandForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.org.collection.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`operationId`).d('工艺编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('operationId', {})(
                <Lov
                  code="MT.OPERATION"
                  queryParams={{ tenantId }}
                  textValue={operationName}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      operationName: item.operationName,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('operationName')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`materialId`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {})(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  // textField="materialCode"
                  textValue={materialCode}
                  onChange={(value, item) => {
                    form.setFieldsValue({
                      materialCode: item.materialCode,
                    });
                  }}
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
              label={intl.get(`${modelPrompt}.productionVersion`).d('物料版本')}
            >
              {getFieldDecorator('productionVersion')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
