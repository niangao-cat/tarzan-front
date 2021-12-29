/*
 * @Description: 巡检单搜索
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-06 09:02:39
 */


import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import {
  DEBOUNCE_TIME,
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
@cacheComponent({ cacheKey: '/hqms/pqc-doc-query' })
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
      form.validateFields(err => {
        if (!err) {
          onSearch();
        }
      });
    }
  }

  @Throttle(DEBOUNCE_TIME)
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
    const modelPrompt = 'hqms.pqcDocQuery.model.pqcDocQuery';
    const {
      form,
      tenantId,
      docTypeMap,
      inspectionResultList,
    } = this.props;
    const { expandForm = false } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.departmentName`).d('事业部')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('departmentId')(
                <Lov code="HME.BUSINESS_AREA" queryParams={{ tenantId }} textField="description" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workshopName`).d('车间')}
            >
              {getFieldDecorator('workshopId')(
                <Lov code="HME_WORK_SHOP" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.prodLineId`).d('生产线')}
            >
              {getFieldDecorator('prodLineId')(
                <Lov code="Z.PRODLINE" queryParams={{ tenantId }} textField="prodLineName" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get('hzero.common.button.viewMore').d('更多查询')}
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workcellName`).d('工序')}
            >
              {getFieldDecorator('workcellId')(
                <Lov code="HME.WORK_PROCESS" queryParams={{ tenantId }} textField="workcellName" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.pqcNumber`).d('巡检单')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('pqcNumber')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.inspectionStatus`).d('单据类型')}
            >
              {getFieldDecorator('inspectionStatus')(
                <Select allowClear>
                  {docTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialName`).d('物料')}
            >
              {getFieldDecorator('materialId')(
                <Lov code="MT.MATERIAL" queryParams={{ tenantId }} textField="materialName" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialLotCode`).d('产品SN')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.workOrderNum`).d('工单')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderNum')(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.lastUpdatedByName`).d('检验员')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('lastUpdatedByName')(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.inspectionResult`).d('巡检结果')}
            >
              {getFieldDecorator('inspectionResult')(
                <Select allowClear>
                  {inspectionResultList.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
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

export default FilterForm;
