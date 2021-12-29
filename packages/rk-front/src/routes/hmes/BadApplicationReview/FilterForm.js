import React, { Component } from 'react';
import { Form, Button, Row, Col, DatePicker, Input, Select } from 'hzero-ui';
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
import { getDateTimeFormat } from 'utils/utils';
import moment from 'moment';

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

  @Bind()
  handleSelect(val) {
    const { form } = this.props;
    if (val !== 'Y') {
      form.setFieldsValue({
        supplierCode: '',
        supplierLot: '',
      });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, tenantId, defaultSite, processMethod, ncRecordStatusList, ncTypeList, businessdList, defaultOrganizationVal } = this.props;
    const { getFieldDecorator, getFieldValue, resetFields } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="事业部">
              {getFieldDecorator('areaId', {
                initialValue: defaultOrganizationVal,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '事业部',
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {businessdList.map(e => (
                    <Select.Option key={e.areaId} value={e.areaId}>
                      {e.areaName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='创建时间从'>
              {getFieldDecorator('dateTimeFrom', {
                rules: [
                  {
                    required: !getFieldValue('materialLotCode') && !getFieldValue('incidentNum') && !getFieldValue('workOrderNum'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '创建时间从',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('dateTimeTo') &&
                    moment(getFieldValue('dateTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='创建时间至'>
              {getFieldDecorator('dateTimeTo', {
                rules: [
                  {
                    required: !getFieldValue('materialLotCode') && !getFieldValue('incidentNum') && !getFieldValue('workOrderNum'),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '创建时间至',
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('dateTimeFrom') &&
                    moment(getFieldValue('dateTimeFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.toggleForm}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button>
              <Button data-code="reset" onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                // data-code="search"
                type="primary"
                htmlType="submit"
                onClick={this.handleSearch}
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {this.state.expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码组'>
                {getFieldDecorator('ncGroupId', {
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '不良代码组',
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                    }}
                    allowClear
                    code="MT.NC_GROUP"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良代码'>
                {getFieldDecorator('ncCodeId', {
                })(
                  <Lov
                    code="MT.NC_CODE"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='不良类型'>
                {getFieldDecorator('ncType', {
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '不良类型',
                      }),
                    },
                  ],
                })(
                  <Select allowClear onChange={val => this.handleSelect(val)}>
                    {ncTypeList.map(item => (
                      <Select.Option key={item.value}>{item.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          )
        }
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工序'>
                  {getFieldDecorator('processId', {})(
                    <Lov
                      code="HME.NC_PROCESS"
                      allowClear
                      // textValue={record.workShopDesc}
                      disabled={!getFieldValue('prodLineId')}
                      queryParams={{
                        tenantId,
                        prodLineId: getFieldValue('prodLineId'),
                      }}
                      onChange={() => {
                        resetFields('workcellId');
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='责任工位'>
                  {getFieldDecorator('workcellId', {})(
                    <Lov
                      code="HME.NC_WORKCERLL"
                      allowClear
                      disabled={!getFieldValue('processId')}
                      queryParams={{
                        tenantId,
                        processId: getFieldValue('processId'),
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='产品料号'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('materialId', {})(
                    <Lov
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='班次'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('enableFlag', {})(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='序列号'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('materialLotCode', {})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='不良单号'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('incidentNum', {})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='工单号'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('workOrderNum', {})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  label='处理方法'
                  {...SEARCH_FORM_ITEM_LAYOUT}
                >
                  {getFieldDecorator('disposeMethod', {})(
                    <Select style={{ width: '100%' }} allowClear>
                      {processMethod.map(item => {
                        return (
                          <Select.Option value={item.value} key={item.value}>
                            {item.meaning}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item
                  {...SEARCH_FORM_ITEM_LAYOUT}
                  label='状态'
                >
                  {getFieldDecorator('status', {})(
                    <Select allowClear>
                      {ncRecordStatusList.map(item => (
                        <Select.Option key={item.statusCode}>{item.description}</Select.Option>
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
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="生产线">
                  {getFieldDecorator('prodLineId', {})(
                    <Lov
                      code="MT.PRODLINE"
                      allowClear
                      queryParams={{
                        tenantId,
                        siteId: defaultSite.siteId,
                      }}
                      onChange={() => {
                        resetFields('processId');
                        resetFields('workcellId');
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="供应商编码">
                  {getFieldDecorator('supplierId', {})(
                    <Lov
                      queryParams={{ tenantId }}
                      code="MT.SUPPLIER"
                      disabled={getFieldValue('ncType') !== 'Y'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="供应商批次">
                  {getFieldDecorator('supplierLot', {})(
                    <Input
                      disabled={getFieldValue('ncType') !== 'Y'}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
        {
          this.state.expandForm && (
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="材料编码">
                  {getFieldDecorator('componentMaterialId', {})(
                    <Lov
                      code="MT.MATERIAL"
                      queryParams={{ tenantId }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="材料版本">
                  {getFieldDecorator('materialVersion', {})(
                    <Input />
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
