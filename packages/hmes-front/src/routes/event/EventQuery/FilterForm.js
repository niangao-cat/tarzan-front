/**
 * FilterForm - 搜索栏
 * @date: 2019-8-7
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select, DatePicker } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
  DEFAULT_DATE_FORMAT,
} from 'utils/constants';

const modelPrompt = 'tarzan.event.eventQuery.model.eventQuery';
const tenantId = getCurrentOrganizationId();

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} eventQuery - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ eventQuery, loading }) => ({
  eventQuery,
  fetchMessageLoading: loading.effects['eventQuery/fetchEventList'],
}))
@formatterCollections({
  code: ['tarzan.event.eventQuery'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
      orgTypeCode: '', // 组织对象查询lov需要传组织的typeCode
      eventTypeCode: '', // 事件类型Lov的Code
      requestTypeCode: '', // 事件请求类型Lov的Code
    };
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { eventTypeCode, requestTypeCode } = this.state;
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const params = fieldsValue;
        params.startTime = params.startTime.format(DEFAULT_DATETIME_FORMAT);
        params.endTime = params.endTime.format(DEFAULT_DATETIME_FORMAT);
        params.shiftDate = params.shiftDate ? params.shiftDate.format(DEFAULT_DATE_FORMAT) : null;
        params.eventTypeCode = eventTypeCode || null;
        params.requestTypeCode = requestTypeCode || null;
        dispatch({
          type: 'eventQuery/fetchEventList',
          payload: {
            ...params,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    const { form } = this.props;
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
      orgTypeCode: '',
    });
    form.resetFields([
      'materialId',
      'orgType',
      'orgId',
      'lotCode',
      'ownerType',
      'ownerId',
      'requestTypeCode',
    ]);
  }

  /**
   * 查询按钮点击
   * @returns
   */
  @Bind()
  queryValue() {
    this.fetchQueryList();
  }

  @Bind()
  setEventTypeCode(_, record) {
    this.setState({
      eventTypeCode: record.eventTypeCode,
    });
  }

  @Bind()
  setRequestTypeCode(_, record) {
    this.setState({
      requestTypeCode: record.requestTypeCode,
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { queryDetailsVisible, orgTypeCode, eventTypeCode, requestTypeCode } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eventTypeId`).d('事件类型')}
            >
              {getFieldDecorator('eventTypeId')(
                <Lov
                  queryParams={{ tenantId }}
                  textValue={eventTypeCode}
                  onChange={this.setEventTypeCode}
                  code="MT.EVENT_TYPE"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.startTime`).d('开始时间')}
            >
              {getFieldDecorator('startTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.startTime`).d('开始时间'),
                    }),
                  },
                ],
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
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.endTime`).d('结束时间')}
            >
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.endTime`).d('结束时间'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <FormItem>
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {queryDetailsVisible
                  ? intl.get('tarzan.event.eventQuery.button.retractSearch').d('收起查询')
                  : intl.get('tarzan.event.eventQuery.button.moreSearch').d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.queryValue}>
                {intl.get('tarzan.event.eventQuery.button.search').d('查询')}
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.requestTypeId`).d('事件请求类型')}
            >
              {getFieldDecorator('requestTypeId')(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.EVENT_REQUEST"
                  textValue={requestTypeCode}
                  onChange={this.setRequestTypeCode}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.requestIdList`).d('事件请求主键')}
            >
              {getFieldDecorator('requestIdList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                  dropdownStyle={{ display: 'none' }}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.eventIdList`).d('事件主键')}
            >
              {getFieldDecorator('eventIdList')(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  tokenSeparators={[',']}
                  dropdownStyle={{ display: 'none' }}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.operationBy`).d('操作人')}
            >
              {getFieldDecorator('operationBy')(
                <Lov queryParams={{ tenantId }} type={orgTypeCode} code="HIAM.USER.ORG" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.shiftDate`).d('班次日期')}
            >
              {getFieldDecorator('shiftDate')(
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.shiftCode`).d('班次编码')}
            >
              {getFieldDecorator('shiftCode')(<Input />)}
            </Form.Item>
          </Col>
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.workcellId`).d('工作单元查询')}
            >
              {getFieldDecorator('workcellId')(
                <Lov queryParams={{ tenantId }} code="MT.WORKCELL" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.locatorId`).d('库位查询')}
            >
              {getFieldDecorator('locatorId')(<Lov queryParams={{ tenantId }} code="MT.LOCATOR" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
