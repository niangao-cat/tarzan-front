/**
 * 待报废报表
 *@date：2019/10/18
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
import { getDateFormat } from 'utils/utils';
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
      expandForm: false, // 是否显示更多查询
      disableFlag: false, // 是否禁用仓库
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({ siteId: undefined });
    this.setState({ disableFlag: true });
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
   * 监听工厂变化,查询仓库列表
   * @param value
   */
  @Bind()
  handleSiteChange(value) {
    const { dispatch, form } = this.props;
    form.setFieldsValue({ warehouseId: undefined });
    if (isEmpty(value)) {
      this.setState({ disableFlag: true });
    } else {
      dispatch({
        type: 'scrapReport/queryWarehouseList',
        payload: {
          siteId: value,
        },
      });
      this.setState({ disableFlag: false });
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const modelPrompt = 'hwms.requisitionAndReturn.model.requisitionAndReturn';
    const modelPrompt2 = 'hwms.scrapReport.model.scrapReport';
    const { form, tenantId, statusMap, siteMap, applyMap, warehouseMap, defaultSite } = this.props;
    const { expandForm = false, disableFlag = false } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt2}.scrapNum`).d('报废申请单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.plantCode`).d('工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.plantCode`).d('工厂'),
                    }),
                  },
                ],
              })(
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
              label={intl.get(`${modelPrompt2}.warehouse`).d('仓库')}
            >
              {getFieldDecorator('warehouseId', {})(
                <Select allowClear disabled={disableFlag}>
                  {warehouseMap.map(item => (
                    <Select.Option key={item.warehouseId}>{item.description}</Select.Option>
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
              label={intl.get(`${modelPrompt}.costCenter`).d('成本中心')}
            >
              {getFieldDecorator('costCenterId', {})(
                <Lov code="WMS.COST_CENTER" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
            >
              {getFieldDecorator('materialId', {})(
                <Lov code="Z.MATERIALCODE" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.docStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus', {})(
                <Select allowClear>
                  {statusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.enterDateFrom`).d('转入日期从')}
            >
              {getFieldDecorator('enterDateStart', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('enterDateEnd') &&
                    moment(getFieldValue('enterDateEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.enterDateTo`).d('转入日期至')}
            >
              {getFieldDecorator('enterDateEnd', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('enterDateStart') &&
                    moment(getFieldValue('enterDateStart')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${modelPrompt}.materialLotCode`).d('实物条码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode', {})(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} style={{ display: expandForm ? 'block' : 'none' }}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.creationDateFrom`).d('创建时间从')}
            >
              {getFieldDecorator('creationDateStart', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
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
              label={intl.get(`${modelPrompt}.creationDateTo`).d('创建时间至')}
            >
              {getFieldDecorator('creationDateEnd', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
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
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt2}.applicationFlag`).d('是否已申请')}
            >
              {getFieldDecorator('applicationFlag', {})(
                <Select allowClear>
                  {applyMap.map(item => (
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
