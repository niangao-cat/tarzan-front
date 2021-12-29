import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import cacheComponent from 'components/CacheComponent';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hqms/material-inspection-plan/list' })
class FilterForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
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

  // 查询
  @Bind()
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch(values);
        }
      });
    }
  }

  // 头数据创建抽屉展开
  @Bind()
  createHeadDataDrawer(flag) {
    const { createHeadDataDrawer } = this.props;
    createHeadDataDrawer({}, flag);
  }

  // 查询条件展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, testTypeLov, siteList = [] } = this.props;
    const { getFieldDecorator } = form;
    const {
      materialCode = '',
    } = this.props.form.getFieldsValue();
    const { expandForm } = this.state;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="组织" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('siteId', {})(
                <Select allowClear>
                  {siteList.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialId', {})(
                <Lov
                  code="QMS.MATERIAL"
                  queryParams={{ tenantId: getCurrentOrganizationId() }}
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="检验类型">
              {getFieldDecorator('inspectionType', {})(
                <Select allowClear>
                  {testTypeLov.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                data-code="search"
                type="primary"
                htmlType="submit"
                icon="search"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="是否有效">
                {getFieldDecorator('enableFlag', {})(
                  <Select>
                    <Select.Option key="Y" value="Y">
                      是
                    </Select.Option>
                    <Select.Option key="N" value="N">
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
