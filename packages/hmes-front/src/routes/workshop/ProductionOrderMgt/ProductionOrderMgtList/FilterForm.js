/**
 * ProductionOrderMgt - 生产指令管理
 * @date: 2019-12-17
 * @author: 许碧婷 <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'hzero-ui';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import cacheComponent from 'components/CacheComponent';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';

@connect(({ productionOrderMgt }) => ({
  productionOrderMgt,
}))
@Form.create()
@cacheComponent({ cacheKey: '/hmes/workshop/production-order-mgt/list' })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  toggleForm = () => {
    const {
      dispatch,
      productionOrderMgt: { searchState = {} },
    } = this.props;
    const { expandForm } = searchState;

    dispatch({
      type: 'productionOrderMgt/updateState',
      payload: {
        searchState: {
          ...searchState,
          expandForm: !expandForm,
        },
      },
    });
  };

  handleFormReset = () => {
    const {
      handleFormReset = c => c,
      form,
      dispatch,
      productionOrderMgt: { searchState = {} },
    } = this.props;
    const { expandForm } = searchState;

    form.resetFields();
    handleFormReset();
    dispatch({
      type: 'productionOrderMgt/updateState',
      payload: {
        searchState: {
          expandForm,
        },
      },
    });
  };

  fetchQueryList = () => {
    const {
      onSearch = c => c,
      form,
      dispatch,
      productionOrderMgt: { searchState = {} },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'productionOrderMgt/updateState',
          payload: {
            searchState: {
              ...searchState,
              ...values,
            },
          },
        });
        onSearch();
      }
    });
  };

  setLovState = (record, type) => {
    const {
      dispatch,
      form,
      productionOrderMgt: { searchState = {} },
    } = this.props;

    form.setFieldsValue({
      siteCode: record.siteCode,
      materialCode: record.materialCode,
      prodLineCode: record.prodLineCode,
      customerCode: record.customerCode,
    });

    dispatch({
      type: 'productionOrderMgt/updateState',
      payload: {
        searchState: {
          ...searchState,
          [type]: record[type],
        },
      },
    });
  };

  render() {
    const {
      form,
      productionOrderMgt: {
        workOrderTypeOptions = [],
        workOrderStatusOptions = [],
        searchState = {},
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      siteId,
      workOrderNum,
      materialId,
      workOrderType,
      status,
      productionLineId,
      planStartTimeFrom,
      planStartTimeTo,
      customerId,
      planEndTimeFrom,
      planEndTimeTo,
      expandForm,
    } = searchState;
    const {
      siteCode = '',
      materialCode = '',
      prodLineCode = '',
      customerCode='',
    } = this.props.form.getFieldsValue();
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteId`).d('站点')}
            >
              {getFieldDecorator('siteId', {
                initialValue: siteId,
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  textValue={siteCode}
                  disabled={false}
                  onChange={(rel, record) => this.setLovState(record, 'siteCode')}
                />
              )}
            </Form.Item>
            <Form.Item
              style={{ display: 'none' }}
            >
              {getFieldDecorator('siteCode')(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workOrderNum`).d('WO编码')}
            >
              {getFieldDecorator('workOrderNum', {
                initialValue: workOrderNum,
              })(<Input autocomplete="off" />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialId`).d('物料')}
            >
              {getFieldDecorator('materialId', {
                initialValue: materialId,
              })(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={materialCode}
                  disabled={false}
                  onChange={(rel, record) => this.setLovState(record, 'materialCode')}
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
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {expandForm
                  ? `${intl.get(`${modelPrompt}.stopSearch`).d('收起查询')}`
                  : `${intl.get(`${modelPrompt}.expandSearch`).d('更多查询')}`}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get(`${modelPrompt}.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get(`${modelPrompt}.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: expandForm ? 'block' : 'none' }}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.workOrderType`).d('WO类型')}
              >
                {getFieldDecorator('workOrderType', {
                  initialValue: workOrderType,
                })(
                  <Select style={{ width: '100%' }} allowClear mode="multiple">
                    {workOrderTypeOptions.map(wo => {
                      return (
                        <Select.Option value={wo.typeCode} key={wo.typeCode}>
                          {wo.description}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.status`).d('WO状态')}
              >
                {getFieldDecorator('status', {
                  initialValue: status,
                })(
                  <Select mode="multiple" style={{ width: '100%' }} allowClear>
                    {workOrderStatusOptions.map(wo => {
                      return (
                        <Select.Option value={wo.statusCode} key={wo.statusCode}>
                          {wo.description}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.productionLineId`).d('生产线')}
              >
                {getFieldDecorator('productionLineId', {
                  initialValue: productionLineId,
                })(
                  <Lov
                    code="MT.PRODLINE"
                    queryParams={{ tenantId }}
                    disabled={false}
                    textValue={prodLineCode}
                    onChange={(rel, record) => this.setLovState(record, 'prodLineCode')}
                  />
                )}
              </Form.Item>
              <Form.Item
                style={{ display: 'none' }}
              >
                {getFieldDecorator('prodLineCode')(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.planStartTimeFrom`).d('开始时间从')}
              >
                {getFieldDecorator('planStartTimeFrom', {
                  initialValue: planStartTimeFrom || null,
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.planStartTimeTo`).d('开始时间至')}
              >
                {getFieldDecorator('planStartTimeTo', {
                  initialValue: planStartTimeTo || null,
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.customerId`).d('客户')}
              >
                {getFieldDecorator('customerId', {
                  initialValue: customerId,
                })(
                  <Lov
                    code="MT.CUSTOMER"
                    queryParams={{ tenantId }}
                    disabled={false}
                    textValue={customerCode}
                    onChange={(rel, record) => this.setLovState(record, 'customerCode')}
                  />
                )}
              </Form.Item>
              <Form.Item
                style={{ display: 'none' }}
              >
                {getFieldDecorator('customerCode')(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.planEndTimeFrom`).d('结束时间从')}
              >
                {getFieldDecorator('planEndTimeFrom', {
                  initialValue: planEndTimeFrom || null,
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.planEndTimeTo`).d('结束时间至')}
              >
                {getFieldDecorator('planEndTimeTo', {
                  initialValue: planEndTimeTo || null,
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}
