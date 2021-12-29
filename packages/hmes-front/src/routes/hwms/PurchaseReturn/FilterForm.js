/**
 * 采购退货单查询
 *@date：2019/10/15
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'hzero-ui';
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
    const modelPrompt = 'hwms.purchaseReturn.model.purchaseReturn';
    const modelPromt2 = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const { form, tenantId, statusMap, siteMap } = this.props;
    const { expandForm = false } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPromt2}.docNum`).d('单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt2}.docStatus`).d('单据状态')}
            >
              {getFieldDecorator('status', {})(
                <Select allowClear>
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
              label={intl.get(`${modelPromt2}.plantCode`).d('工厂')}
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
              label={intl.get(`${modelPromt2}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId', {})(
                <Lov code="Z.MATERIALCODE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.supplier`).d('供应商')}
            >
              {getFieldDecorator('supplierId', {})(
                <Lov code="Z.SUPPLIER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialLotCode`).d('实物条码')}
            >
              {getFieldDecorator('materialLotCode', {})(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt2}.creationDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateStart', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateEnd') &&
                    moment(getFieldValue('creationDateEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt2}.creationDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateEnd', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('creationDateStart') &&
                    moment(getFieldValue('creationDateStart')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.sourceOrder`).d('采购订单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('sourceOrder', {})(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.demandTimeFrom`).d('计划退货时间从')}
            >
              {getFieldDecorator('demandTimeStart', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeEnd') &&
                    moment(getFieldValue('demandTimeEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.demandTimeFrom`).d('计划退货时间至')}
            >
              {getFieldDecorator('demandTimeEnd', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('demandTimeStart') &&
                    moment(getFieldValue('demandTimeStart')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.lastUpdatedBy`).d('执行人')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('lastUpdatedBy', {})(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lastUpdateDateStart`).d('完成时间从')}
            >
              {getFieldDecorator('lastUpdateDateStart', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('lastUpdateDateEnd') &&
                    moment(getFieldValue('lastUpdateDateEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.lastUpdateDateEnd`).d('完成时间至')}
            >
              {getFieldDecorator('lastUpdateDateEnd', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('lastUpdateDateStart') &&
                    moment(getFieldValue('lastUpdateDateStart')).isAfter(currentDate, 'second')
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
