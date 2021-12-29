/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'hzero-ui';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getDateFormat } from 'utils/utils';
import moment from 'moment';
import {
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_CLASSNAME,
  SEARCH_COL_CLASSNAME,
} from 'utils/constants';

/**
 *  页面搜索框
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} onSearch - 搜索方法
 * @return React.element
 */
@Form.create({ fieldNameProp: null }) // 创建一个表单对象
class DetailFilterForm extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this); // 子组件form对象传到父组件对象中
    }
    this.state = {
      queryDetailsVisible: false, // 更多查询的收起与展开
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
    form.validateFields(err => {
      if (!err) {
        onSearch();
      }
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
   * render
   * @returns React.element
   */
  render() {
    const commonModelPrompt = 'hwms.deliverQuery.model.deliverQuery';
    const { queryDetailsVisible } = this.state;
    const { form, barCodestatusMap, qualityStatusMap } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.materialLotCode`).d('条码号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('materialLotCode', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.status`).d('条码状态')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('status', {
                // initialValue: detail.qualityStatus,
              })(
                <Select allowClear>
                  {barCodestatusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.qualityStatus`).d('检验结果')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('qualityStatus', {
                // initialValue: detail.qualityStatus,
              })(
                <Select allowClear>
                  {qualityStatusMap.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button style={{ marginLeft: 8 }} onClick={this.handleQueryDetails}>
                {queryDetailsVisible
                  ? intl.get('hzero.common.button.retractSearch').d('收起查询')
                  : intl.get('hzero.common.button.moreSearch').d('更多查询')}
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
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.creationDateStart`).d('接收时间从')}
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
              label={intl.get(`${commonModelPrompt}.creationDateEnd`).d('接收时间至')}
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
        </Row>
        <Row
          {...SEARCH_FORM_ROW_LAYOUT}
          style={{ display: queryDetailsVisible ? 'block' : 'none' }}
        >
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.inLocatorTimeStart`).d('入库时间从')}
            >
              {getFieldDecorator('inLocatorTimeStart', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('inLocatorTimeEnd') &&
                    moment(getFieldValue('inLocatorTimeEnd')).isAfter(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.inLocatorTimeEnd`).d('入库时间至')}
            >
              {getFieldDecorator('inLocatorTimeEnd', {})(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('inLocatorTimeStart') &&
                    moment(getFieldValue('inLocatorTimeStart')).isAfter(currentDate, 'second')
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

export default DetailFilterForm;
