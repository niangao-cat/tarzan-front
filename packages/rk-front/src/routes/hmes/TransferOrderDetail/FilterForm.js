import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, DatePicker, Input } from 'hzero-ui';
import moment from 'moment';
import Lov from 'components/Lov';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';

const tenantId = getCurrentOrganizationId();
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
      form.validateFields((err, fieldsValue) => {
        if (!err) {
          onSearch(fieldsValue);
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
    const { form, docStatus = [], instructionDocTypeList = [], defaultSite = {} } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="制单时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('creationDateFrom', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`creationDateFrom`).d('制单时间从'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  placeholder=""
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateTo') &&
                    moment(getFieldValue('creationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="制单时间至">
              {getFieldDecorator('creationDateTo', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`creationDateTo`).d('制单时间至'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  placeholder=""
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateFrom') &&
                    moment(getFieldValue('creationDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="调拨单">
              {getFieldDecorator('instructionDocNum', {
              })(
                <Input />
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
              <Button data-code="reset" icon="reload" onClick={this.handleFormReset}>
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
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="制单人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('createdBy', {
              })(
                <Lov code="HIAM.USER.ORG" allowClear />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="单据状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('instructionDocStatus', {
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {docStatus.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="调拨单类型" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('instructionDocType', {
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {instructionDocTypeList.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCode', {
              })(
                <Lov
                  isInput
                  allowClear
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  onChange={(_value, record) => {
                    form.setFieldsValue({
                      materialCode: record.materialCode,
                    });
                  }
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料版本" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialVersion', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              Z
              label='来源仓库'
            >
              {getFieldDecorator('fromWarehouseId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: defaultSite.siteId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='目标仓库'
            >
              {getFieldDecorator('toWarehouseId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: defaultSite.siteId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='来源货位'
            >
              {getFieldDecorator('fromLocatorId')(
                <Lov
                  code="MT.MTL_LOCATOR"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>

          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='目标货位'
            >
              {getFieldDecorator('toLocatorId')(
                <Lov code="MT.MTL_LOCATOR" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='执行人'
            >
              {getFieldDecorator('executorUserId')(
                <Lov
                  code="HIAM.USER.ORG"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="执行时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('executorDateFrom')(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  placeholder={null}
                  disabledDate={currentDate =>
                    getFieldValue('executorDateTo') &&
                    moment(getFieldValue('executorDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="执行时间至">
              {getFieldDecorator('executorDateTo')(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  placeholder={null}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('executorDateFrom') &&
                    moment(getFieldValue('executorDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='签收条码号'
            >
              {getFieldDecorator('materialLotCode')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='物料批次'
            >
              {getFieldDecorator('lot')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='供应商批次'
            >
              {getFieldDecorator('supplierLot')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='调拨操作人'
            >
              {getFieldDecorator('allocationUserId')(
                <Lov
                  code="HIAM.USER.ORG"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="调拨操作从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('allocationDateFrom')(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  placeholder={null}
                  disabledDate={currentDate =>
                    getFieldValue('allocationDateTo') &&
                    moment(getFieldValue('allocationDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="调拨操作至">
              {getFieldDecorator('allocationDateTo')(
                <DatePicker
                  showTime
                  format={DEFAULT_DATETIME_FORMAT}
                  placeholder={null}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('allocationDateFrom') &&
                    moment(getFieldValue('allocationDateFrom')).isAfter(currentDate, 'second')
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
