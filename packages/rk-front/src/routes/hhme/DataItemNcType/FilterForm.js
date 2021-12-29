import React, { Component } from 'react';
import { Form, Button, Row, Col, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hhme/equipment-inspection-maintenance' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch();
        }
      });
    }
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, status, tenantId, serviceLife } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工艺编码">
              {getFieldDecorator('operationId', {})(
                <Lov
                  code="MT.OPERATION"
                  // textValue={operationName}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="数据组编码">
              {getFieldDecorator('tagGroupId', {})(
                <Lov
                  code="HME.TAG_GROUP"
                  queryParams={{
                    tenantId,
                  }}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="数据项编码">
              {getFieldDecorator('tagId', {})(
                <Lov
                  code="MT.TAG"
                  queryParams={{ tenantId }}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              {/* <Button onClick={this.toggleForm}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button> */}
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='部门' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('businessId', {})(
                    <Lov
                      allowClear
                      code="HME.BUSINESS_AREA"
                      queryParams={{
                        tenantId,
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='工艺' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('operationId', {})(
                    <Lov
                      allowClear
                      code="MT.OPERATION"
                      queryParams={{
                        tenantId,
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='设备使用年限' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('serviceLife', {})(
                    <Select allowClear>
                      {serviceLife.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='项目组' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('tagGroupId', {})(
                    <Lov
                      code="HME.TAG_GROUP"
                      queryParams={{
                        tenantId,
                      }}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='状态' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('status', {})(
                    <Select allowClear>
                      {status.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.meaning}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label='有效性' {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('enableFlag', {})(
                    <Select allowClear>
                      <Select.Option key='Y' value='Y'>
                        是
                      </Select.Option>
                      <Select.Option key='N' value='N'>
                        否
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
      </Form>
    );
  }
}

export default FilterForm;
