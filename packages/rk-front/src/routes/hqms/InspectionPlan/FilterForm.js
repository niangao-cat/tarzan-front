import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
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

  @Bind()
  handleCopy() {
    const { onOpenModal } = this.props;
    if (onOpenModal) {
      onOpenModal();
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, testTypeLov, pushMaterPlan, deleteHead, selectedHead, tenantId, copyLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="组织" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('siteId', {})(
                <Lov queryParams={{ tenantId }} code="MT.SITE" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialId', {})(
                <Lov code="QMS.MATERIAL" queryParams={{ tenantId: getCurrentOrganizationId() }} />
              )}
            </Form.Item>
          </Col>
          <Col span={12} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
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
              <Button type="primary">模板导出</Button>
              <Button type="primary">数据导入</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
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
          <Col span={12} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button type="primary" onClick={() => this.createHeadDataDrawer({}, true)}>
                新建
              </Button>
              <Popconfirm title="确认删除？" okText="确定" cancelText="取消" onConfirm={deleteHead}>
                <Button type="primary">删除</Button>
              </Popconfirm>
              <Button type="primary" onClick={() => pushMaterPlan()}>
                发布
              </Button>
              <Button
                type="default"
                onClick={this.handleCopy}
                disabled={selectedHead.length === 0}
                loading={copyLoading}
              >
                复制检验计划
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
