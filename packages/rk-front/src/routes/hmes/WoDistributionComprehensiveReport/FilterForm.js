/*
 * @Description: 工单配送综合查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-24 16:24:49
 * @LastEditTime: 2020-12-28 19:41:51
 */
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
import MultipleLov from '../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../components/Modal/ModalContainer';


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
    const { form, docStatus = [], rowStatus = [] } = this.props;
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
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
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
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
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
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="配送单">
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
            <Form.Item label="更新时间从" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('updateDateFrom', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`updateDateFrom`).d('更新时间从'),
                //     }),
                //   },
                // ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('updateDateTo') &&
                    moment(getFieldValue('updateDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="更新时间至">
              {getFieldDecorator('updateDateTo', {
                // rules: [
                //   {
                //     required: true,
                //     message: intl.get('hzero.common.validation.notNull', {
                //       name: intl.get(`updateDateTo`).d('更新时间至'),
                //     }),
                //   },
                // ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  format={DEFAULT_DATETIME_FORMAT}
                  style={{ width: '100%' }}
                  disabledDate={currentDate =>
                    getFieldValue('updateDateFrom') &&
                    moment(getFieldValue('updateDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="行状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('instructionStatus', {
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {rowStatus.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('instructionDocStatus', {
              })(
                <Select style={{ width: '100%' }} allowClear>
                  {docStatus.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="工段" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('workcellIdList', {
              })(
                <MultipleLov
                  code="HME.WORKCELL"
                  allowClear
                  queryParams={{
                    typeFlag: 'LINE',
                    prodLineId: getFieldValue('prodLineIdList'),
                    tenantId,
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="产线" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('prodLineIdList', {
              })(
                <MultipleLov
                  code="Z.PRODLINE"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="目标仓库" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('toWarehouseIdList', {
              })(
                <MultipleLov
                  code="WMS.STOCK_LOCATOR"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="是否补料单" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('replenishmentFlag', {
              })(
                <Select style={{ width: '100%' }} allowClear>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="补料单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('replenishmentListNum', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="是否备齐" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('suiteFlag', {
              })(
                <Select style={{ width: '100%' }} allowClear>
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
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="制单人" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('createdBy', {
              })(
                <Lov code="HIAM.USER.ORG" allowClear />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料编码" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialCodeList', {
              })(
                <MultipleLov
                  // isInput
                  allowClear
                  code="MT.MATERIAL"
                  queryParams={{ tenantId }}
                  lovOptions={{
                    displayField: 'materialCode',
                    valueField: 'materialCode',
                  }}
                  // onChange={(_value, record) => {
                  //   console.log('record', record.map(item => item.materialCode));
                  //   form.setFieldsValue({
                  //     materialCodeList: record.map(item => item.materialCode),
                  //   });
                  // }
                  // }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item label="物料版本" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('materialVersion', {
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
        <ModalContainer ref={registerContainer} />
      </Form>
    );
  }
}

export default FilterForm;
