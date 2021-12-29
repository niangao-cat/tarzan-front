/*
 * @Description: 领退料平台-首页搜索
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-09 11:14:02
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'hzero-ui';
import cacheComponent from 'components/CacheComponent';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import moment from 'moment';
import { getDateTimeFormat } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import { getSiteId } from '@/utils/utils';

/**
 *  页面搜索框
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null })
@cacheComponent({ cacheKey: '/hwms/requisition-return/query' })
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
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const {
      form,
      tenantId,
      statusMap,
      docTypeMap,
      siteMap,
      accountsType,
      queryStorageList,
    } = this.props;
    const { expandForm = false } = this.state;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.instructionDocNum`).d('单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionDocStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus', {})(
                <Select
                  allowClear
                  mode="multiple"
                >
                  {statusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.instructionDocType`).d('单据类型')}
            >
              {getFieldDecorator('instructionDocType', {})(
                <Select allowClear>
                  {docTypeMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
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
              label={intl.get(`${modelPrompt}.settleAccounts`).d('结算类型')}
            >
              {getFieldDecorator('settleAccounts', {
              })(
                <Select
                  allowClear
                  onChange={() => {
                    setFieldsValue({
                      costCenterId: null,
                      internalOrder: null,
                    });
                  }}
                >
                  {accountsType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.costCenter`).d('成本中心')}
            >
              {getFieldDecorator('costCenterId', {})(
                <Lov
                  // disabled={getFieldValue('settleAccounts') !== 'COST_CENTER'}
                  code="WMS.COST_CENTER"
                  queryParams={{
                    tenantId,
                    enableFlag: 'Y',
                  }}
                  textField="description"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='内部订单'
            >
              {getFieldDecorator('internalOrder', {})(
                <Lov
                  // disabled={getFieldValue('settleAccounts') !== 'INTERNAL_ORDER'}
                  code="WMS.INTERNAL_ORDER"
                  queryParams={{
                    tenantId,
                    enableFlag: 'Y',
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.plantCode`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: getSiteId(),
              })(
                <Select allowClear onChange={value => queryStorageList(value)}>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.siteCode}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId', {})(
                <Lov code="QMS.MATERIAL" queryParams={{ tenantId }} textField="materialCode" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialVersion`).d('版本')}
            >
              {getFieldDecorator('materialVersion', {})(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.toWarehouseId`).d('目标仓库')}
            >
              {getFieldDecorator('toWarehouseId', {})(
                <Lov
                  code="WMS.WAREHOUSE"
                  queryParams={{
                    tenantId,
                    siteId: getFieldValue('siteId') || getSiteId(),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.toLocatorId`).d('目标货位')}
            >
              {getFieldDecorator('toLocatorId', {})(
                <Lov
                  code="WMS.LOCATOR"
                  queryParams={{
                    tenantId,
                    parentLocatorId: getFieldValue('toWarehouseId'),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.createdBy`).d('申请人')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('createdBy', {})(
                <Lov code="HME.USER" queryParams={{ tenantId }} textField="realName" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.creationDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateFrom', {})(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.creationDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateTo', {})(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
