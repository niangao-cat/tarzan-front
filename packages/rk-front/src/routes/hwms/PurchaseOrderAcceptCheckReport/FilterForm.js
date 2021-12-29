/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 采购订单接收检验统计报表
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, DatePicker, Select, Input } from 'hzero-ui';
import { isEmpty, isFunction } from 'lodash';
import moment from 'moment';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import MultipleLov from '../../../components/MultipleLov/index';

const commonModelPrompt = 'tarzan.hwms.purchaseOrderAcceptCheckReport';


@Form.create({ fieldNameProp: null })
export default class FilterForm extends Component {
  constructor(props) {
    super(props);
    if(isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
      expandForm: false,
    };
  }

  // 设置展开/关闭 更多查询
  @Bind()
  setExpandForm() {
    this.setState({ expandForm: !this.state.expandForm });
  }

  // 重置查询
  @Bind
  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  @Bind()
  handleSearch() {
    const { onSearch } = this.props;
    if(onSearch) {
      onSearch();
    }
  }

  render() {
    const {
      siteMap = [],
      getSite = {},
    } = this.props;
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.siteId`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: getSite.siteId,
              })(
                <Select allowClear>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId} value={item.siteId}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.instructionDocNum`).d('采购订单')}
            >
              {getFieldDecorator('instructionDocNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.deliveryInstructionDocNum`).d('送货单号')}
            >
              {getFieldDecorator('deliveryInstructionDocNum')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={this.setExpandForm}>
                {this.state.expandForm
                  ? intl.get('hzero.common.button.collected').d('收起查询')
                  : intl.get(`hzero.common.button.viewMore`).d('更多查询')}
              </Button>
              <Button onClick={this.resetSearch}>
                {intl.get(`hzero.common.button.reset`).d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.handleSearch}>
                {intl.get(`hzero.common.button.search`).d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialId`).d('物料编码')}
            >
              {getFieldDecorator('materialId')(
                <MultipleLov
                  code="HME.SITE_MATERIAL"
                  lovOptions={{ valueField: 'materialId' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                  // onChange={() => {
                  //   setFieldsValue({
                  //     materialVersion: '',
                  //   });
                  // }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.actualReceivedDateFrom`).d('接收时间从')}
            >
              {getFieldDecorator('actualReceivedDateFrom', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('instructionDocNum')) && isEmpty(getFieldValue('deliveryInstructionDocNum')) && isEmpty(getFieldValue('demandTimeFrom')) && isEmpty(getFieldValue('demandTimeTo')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.actualReceivedDateFrom`).d('接收时间从'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualReceivedDateTo') &&
                    moment(getFieldValue('actualReceivedDateTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.actualReceivedDateTo`).d('接收时间至')}
            >
              {getFieldDecorator('actualReceivedDateTo', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('instructionDocNum')) && isEmpty(getFieldValue('deliveryInstructionDocNum')) && isEmpty(getFieldValue('demandTimeFrom')) && isEmpty(getFieldValue('demandTimeTo')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.actualReceivedDateTo`).d('接收时间至'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('actualReceivedDateFrom') &&
                    moment(getFieldValue('actualReceivedDateFrom')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: this.state.expandForm ? '' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.supplierId`).d('供应商')}
            >
              {getFieldDecorator('supplierId')(
                <MultipleLov
                  code="Z.SUPPLIER"
                  lovOptions={{ valueField: 'supplierId' }}
                  queryParams={{
                    tenantId: getCurrentOrganizationId(),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.demandTimeFrom`).d('计划到货时间从')}
            >
              {getFieldDecorator('demandTimeFrom', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('instructionDocNum')) && isEmpty(getFieldValue('deliveryInstructionDocNum')) && isEmpty(getFieldValue('actualReceivedDateFrom')) && isEmpty(getFieldValue('actualReceivedDateTo')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.demandTimeFrom`).d('计划到货时间从'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeTo') &&
                    moment(getFieldValue('demandTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.demandTimeTo`).d('计划到货时间至')}
            >
              {getFieldDecorator('demandTimeTo', {
                rules: [
                  {
                    required: isEmpty(getFieldValue('instructionDocNum')) && isEmpty(getFieldValue('deliveryInstructionDocNum')) && isEmpty(getFieldValue('actualReceivedDateFrom')) && isEmpty(getFieldValue('actualReceivedDateTo')),
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${commonModelPrompt}.demandTimeTo`).d('计划到货时间至'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeFrom') &&
                    moment(getFieldValue('demandTimeFrom')).isAfter(currentDate, 'second')
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
