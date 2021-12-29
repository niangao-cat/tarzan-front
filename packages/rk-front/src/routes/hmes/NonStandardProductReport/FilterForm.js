import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, Input, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import { FormItem as PermissionFormItem } from 'components/Permission';
import moment from 'moment';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
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
    const { form, resetForm } = this.props;
    form.resetFields();
    resetForm();
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
    const { form, onSelectedDivision, woStatus = [], siteId, path } = this.props;
    const { expandForm } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col span="6">
            <Form.Item label="工单状态" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('woStatus', {
                // rules: [{}],
              })(
                <Select onChange={onSelectedDivision} mode="multiple">
                  {woStatus.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="车间">
              {getFieldDecorator('workshopId', {
                rules: [{}],
              })(
                <Lov
                  code="HME.SITE_AREA"
                  tex
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('siteId'), areaCategory: "CJ" }}
                />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              label={intl.get(`prodLineId`).d('产线')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('prodLineId', {
                rules: [{}],
              })(
                <Lov
                  code="MT.PRODLINE"
                  tex
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('siteId') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col span="6" className={SEARCH_COL_CLASSNAME}>
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
          <Col span="6">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`workOrderNum`).d('工单号')}
            >
              {getFieldDecorator('workOrderNum', {
                rules: [{}],
              })(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item label="销售订单号" {...SEARCH_FORM_ITEM_LAYOUT}>
              {getFieldDecorator('soNum', {
                rules: [{}],
              })(<Input trim />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              label={intl.get(`materialId`).d('产品')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialId', {
              })(
                <Lov
                  code="HME.SITE_MATERIAL"
                  queryParams={{ tenantId, siteId }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col span="6">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`creationStartDate`).d('创建开始时间')}
            >
              {getFieldDecorator('creationStartDate', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationEndDate') &&
                    moment(getFieldValue('creationEndDate')).isBefore(currentDate, 'second')
                  }
                />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`creationEndDate`).d('创建结束时间')}
            >
              {getFieldDecorator('creationEndDate', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('creationStartDate') &&
                    moment(getFieldValue('creationStartDate')).isAfter(currentDate, 'second')
                  }
                />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <PermissionFormItem
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`customerCode`).d('客户编码')}
              permissionList={[
                {
                  code: `${path}.formItem.customerCode`,
                  type: 'formItem',
                  meaning: '非标产品查询-客户编码',
                },
              ]}
            >
              {getFieldDecorator('customerCode', {
              })(<Input trim />)}
            </PermissionFormItem>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? '' : 'none' }}>
          <Col span="6">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`releaseStartDate`).d('下达开始时间')}
            >
              {getFieldDecorator('releaseStartDate', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('releaseEndDate') &&
                    moment(getFieldValue('releaseEndDate')).isBefore(currentDate, 'second')
                  }
                />)}
            </Form.Item>
          </Col>
          <Col span="6">
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`releaseEndDate`).d('下达结束时间')}
            >
              {getFieldDecorator('releaseEndDate', {
              })(
                <DatePicker
                  showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
                  placeholder=""
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  disabledDate={currentDate =>
                    getFieldValue('releaseStartDate') &&
                    moment(getFieldValue('releaseStartDate')).isAfter(currentDate, 'second')
                  }
                />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
