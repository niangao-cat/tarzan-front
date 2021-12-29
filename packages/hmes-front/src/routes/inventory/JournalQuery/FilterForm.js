/**
 * FilterForm - 搜索栏
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input, DatePicker, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';

import formatterCollections from 'utils/intl/formatterCollections';

const modelPrompt = 'tarzan.inventory.journalQuery.model.journalQuery';
const tenantId = getCurrentOrganizationId();

/**
 * 使用 Form.Item 组件
 */
const FormItem = Form.Item;

@formatterCollections({
  code: ['tarzan.inventory.journalQuery'], // code 为 [服务].[功能]的字符串数组
})
/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ journalQuery, loading }) => ({
  journalQuery,
  fetchMessageLoading: loading.effects['journalQuery/queryBillList'],
}))
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
      orgLovCode: '', // 组织对象查询lov的code
      orgTypeCode: '', // 组织对象查询lov需要传组织的typeCode
      ownerLovCode: '', // 所有者查询lov的code
      selectedSiteId: '', // 选中的站点ID
      orgCode: '', // 组织对象查询Lov显示值
    };
  }

  /**
   * 查询数据
   * @param {object} page 页面基本信息数据
   */
  @Bind()
  fetchQueryList(pagination = {}) {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const parmas = fieldsValue;
        parmas.startTime = parmas.startTime.format(DEFAULT_DATETIME_FORMAT);
        parmas.endTime = parmas.endTime.format(DEFAULT_DATETIME_FORMAT);
        dispatch({
          type: 'journalQuery/queryBillList',
          payload: {
            ...fieldsValue,
            page: pagination,
          },
        });
      }
    });
  }

  /**
   * 选择组织类型
   */
  @Bind()
  changeOrgType(value) {
    this.props.form.resetFields(['orgId']);
    const orgLovCode =
      value === 'LOCATOR' ? 'WMS.LOCATOR_LOV' : 'MT.ORAGANIZATION_BY_TYPE';
    this.setState({
      orgTypeCode: value,
      orgLovCode,
      orgCode: '',
    });
  }

  /**
   * 选择所有者类型
   */
  @Bind()
  changeOwnerType(value) {
    this.props.form.resetFields(['ownerId']);
    let ownerLovCode = '';
    if (value === 'CI' || value === 'IIC') {
      ownerLovCode = 'MT.CUSTOMER';
    } else if (value === 'SI' || value === 'IIS') {
      ownerLovCode = 'MT.SUPPLIER';
    }
    this.setState({
      ownerLovCode,
    });
  }

  /**
   * 重置form表单
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      orgLovCode: '', // 组织对象查询lov的code
      orgTypeCode: '', // 组织对象查询lov需要传组织的typeCode
      ownerLovCode: '', // 所有者查询lov的code
      selectedSiteId: '', // 选中的站点ID
      orgCode: '', // 组织对象查询Lov显示值
    });
  }

  /**
   * 显示或隐藏更多查询条件
   */
  @Bind()
  handleQueryDetails() {
    this.setState({
      queryDetailsVisible: !this.state.queryDetailsVisible,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      queryDetailsVisible,
      orgLovCode,
      ownerLovCode,
      orgTypeCode,
      orgCode,
      selectedSiteId,
    } = this.state;
    const { form, journalQuery } = this.props;
    const { getFieldDecorator } = form;
    const { orgTypeList, ownerTypeList } = journalQuery;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.siteCode`).d('站点')}
            >
              {getFieldDecorator('siteId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('站点'),
                    }),
                  },
                ],
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.SITE"
                  onChange={val => this.setState({ selectedSiteId: val })}
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
                  ? intl.get('tarzan.inventory.journalQuery.button.retractSearch').d('收起查询')
                  : intl.get('tarzan.inventory.journalQuery.button.moreSearch').d('更多查询')}
              </Button>
              <Button onClick={this.handleFormReset}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" htmlType="submit" onClick={this.fetchQueryList}>
                {intl.get('tarzan.inventory.journalQuery.button.search').d('查询')}
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
              label={intl.get(`${modelPrompt}.materialId`).d('事件类型')}
            >
              {getFieldDecorator('eventTypeId')(
                <Lov
                  queryParams={{ tenantId }}
                  onChange={this.setEventTypeCode}
                  code="MT.EVENT_TYPE"
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`warehouseId`).d('仓库')}
            >
              {getFieldDecorator('warehouseId')(
                <Lov
                  code="WMS.ADJUST_WAREHOUSE"
                  queryParams={{ tenantId, siteId: this.props.form.getFieldValue('siteId') }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`locatorId`).d('货位')}
            >
              {getFieldDecorator('locatorId')(
                <Lov code="MT.MTL_LOCATOR" queryParams={{ tenantId }} />
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
              label={intl.get(`${modelPrompt}.materialId`).d('物料')}
            >
              {getFieldDecorator('materialId')(
                <Lov queryParams={{ tenantId }} code="MT.MATERIAL" />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.orgType`).d('组织类型')}
            >
              {getFieldDecorator('orgType')(
                <Select onChange={this.changeOrgType} allowClear>
                  {orgTypeList instanceof Array &&
                    orgTypeList.length !== 0 &&
                    orgTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
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
              label={intl.get(`${modelPrompt}.orgId`).d('组织对象查询')}
            >
              {getFieldDecorator('orgId')(
                <Lov
                  disabled={!(orgTypeCode && selectedSiteId)}
                  textValue={orgCode}
                  queryParams={{ tenantId, type: orgTypeCode, siteId: selectedSiteId }}
                  code={orgLovCode}
                  onChange={(_, record) => {
                    this.setState({ orgCode: record.code });
                  }}
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
              label={intl.get(`${modelPrompt}.lotCode`).d('批次号')}
            >
              {getFieldDecorator('lotCode')(<Input allowClear />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ownerType`).d('所有者类型')}
            >
              {getFieldDecorator('ownerType')(
                <Select onChange={this.changeOwnerType} allowClear>
                  {ownerTypeList instanceof Array &&
                    ownerTypeList.length !== 0 &&
                    ownerTypeList.map(item => {
                      return (
                        <Select.Option value={item.typeCode} key={item.typeCode}>
                          {item.description}
                        </Select.Option>
                      );
                    })}
                  <Select.Option value="" key="NULL">
                    自有
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.ownerId`).d('所有者查询')}
            >
              {getFieldDecorator('ownerId')(
                <Lov disabled={!ownerLovCode} queryParams={{ tenantId }} code={ownerLovCode} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
