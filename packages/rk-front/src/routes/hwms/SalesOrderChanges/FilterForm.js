import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Input } from 'hzero-ui';
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
@cacheComponent({ cacheKey: '/hwms/barcode/list' })
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
          onSearch({});
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
    const { form, tenantId, siteMap = [], statusMap = [], qualityStatusMap = [] } = this.props;
    const { getFieldDecorator } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="实物条码">
              {getFieldDecorator('materialLotCode', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料编码'>
              {getFieldDecorator('materialCode', {})(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  textField="materialCode"
                  isInput
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料描述'>
              {getFieldDecorator('materialName', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('tarzan.org.dataItem.button.viewMore').d('收起查询')
                  : intl.get(`tarzan.org.dataItem.button.viewMore`).d('更多查询')}
              </Button>
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='销售订单号'>
              {getFieldDecorator('soNum', {})(
                <Input />
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='销售订单行号'>
              {getFieldDecorator('soLineNum', {})(
                <Input />
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料版本'>
              {getFieldDecorator('materialVersion', {})(
                <Input />
                  )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`site`).d('工厂')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('siteId', {})(
                <Select allowClear>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='仓库'>
              {getFieldDecorator('warehouseId', {})(
                <Lov code="MT.WARE.HOUSE" queryParams={{ tenantId }} textField="warehouse" />
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`locatorId`).d('货位')}
            >
              {getFieldDecorator('locatorId', {})(
                <Lov
                  code="WMS.MTL_LOCATOR"
                  queryParams={{tenantId}}
                  textField="locatorCode"
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: this.state.expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='状态'>
              {getFieldDecorator('status', {})(
                <Select allowClear>
                  {statusMap.map(ele => (
                    <Select.Option value={ele.value}>{ele.meaning}</Select.Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='质量状态'>
              {getFieldDecorator('qualityStatus', {})(
                <Select allowClear>
                  {qualityStatusMap.map(ele => (
                    <Select.Option value={ele.value}>{ele.meaning}</Select.Option>
                      ))}
                </Select>
                  )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='批次'>
              {getFieldDecorator('lot', {})(
                <Input />
                  )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
