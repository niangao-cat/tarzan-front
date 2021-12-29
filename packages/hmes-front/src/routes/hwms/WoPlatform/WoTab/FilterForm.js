/**
 * 工单发料平台
 *@date：2019/10/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { isFunction, isEmpty } from 'lodash';
import moment from 'moment';
import { getDateTimeFormat, getCurrentUserId } from 'utils/utils';
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
      disabled: true, // 是否禁用计划物料号
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({ disabled: true });
    dispatch({
      type: 'woPlatform/updateState',
      payload: {
        filterValues: {},
      },
    });
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
   * 监听工厂变化,产线同步变化
   */
  @Bind()
  handleSiteChange(value) {
    const { form } = this.props;
    form.setFieldsValue({ productionLine: undefined, planedMaterialCode: undefined });
    if (isEmpty(value)) {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const modelPrompt2 = 'hwms.woPlatform.model.woPlatform';
    const { form, tenantId, woStatusMap, siteMap, demandStatusMap } = this.props;
    const { expandForm = false, disabled } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('工厂')}
            >
              {getFieldDecorator('site', {})(
                <Select allowClear onChange={this.handleSiteChange}>
                  {siteMap.map(item => (
                    <Select.Option key={item.siteId}>{item.description}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.productionLine`).d('产线')}
            >
              {getFieldDecorator('productionLine', {})(
                <Lov
                  code="Z.PRODLINE"
                  queryParams={{
                    tenantId,
                    siteId: form.getFieldValue('site'),
                    userId: getCurrentUserId(),
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.demandListStatus`).d('备料状态')}
            >
              {getFieldDecorator('status', {})(
                <Select allowClear>
                  {demandStatusMap.map(item => (
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
              label={intl.get(`${modelPrompt2}.workOrderNum`).d('生产订单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('workOrderNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.planedStartTimeFrom`).d('预计开始时间从')}
            >
              {getFieldDecorator('planedStartTime', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('planedStartTimeTo') &&
                    moment(getFieldValue('planedStartTimeTo')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.planedStartTimeTo`).d('预计开始时间至')}
            >
              {getFieldDecorator('planedStartTimeTo', {})(
                <DatePicker
                  showTime
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('planedStartTime') &&
                    moment(getFieldValue('planedStartTime')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.planedMaterialCode`).d('计划物料号')}
            >
              {getFieldDecorator('planedMaterialCode', {})(
                <Lov
                  code="Z.MATERIALCODE"
                  queryParams={{ tenantId, siteId: form.getFieldValue('site') }}
                  disabled={disabled}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.workOrderStatus`).d('生产订单状态')}
            >
              {getFieldDecorator('workOrderStatus', {})(
                <Select allowClear>
                  {woStatusMap.map(item => (
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
