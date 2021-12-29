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
import moment from 'moment';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getDateFormat, getCurrentLanguage } from 'utils/utils';
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
class FilterForm extends Component {
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
    const { form, tenantId, statusMap, defaultSite } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.instructionDocNum`).d('送货单号')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator('instructionDocNum', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.supplierId`).d('供应商编码')}
            >
              {getFieldDecorator(
                'supplierId',
                {}
              )(
                <Lov
                  code="Z.SUPPLIER"
                  queryParams={{ tenantId, local: getCurrentLanguage() }}
                  textField="SUPPLIER_CODE"
                  onChange={(value, records) => {
                    setFieldsValue({
                      supplierDes: records.supplierName,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              label={intl.get(`${commonModelPrompt}.materialId`).d('物料编码')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator(
                'materialCode',
                {}
              )(
                <Lov
                  code="MT.MATERIAL"
                  queryParams={{ tenantId, local: getCurrentLanguage() }}
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      materialDes: records ? records.materialName : '',
                    });
                  }}
                  isInput
                />
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
              label={intl.get(`${commonModelPrompt}.instructionDocStatus`).d('送货单状态')}
              {...SEARCH_FORM_ITEM_LAYOUT}
            >
              {getFieldDecorator(
                'instructionDocStatus',
                {}
              )(
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
              label={intl.get(`${commonModelPrompt}.supplierDes`).d('供应商描述')}
            >
              {getFieldDecorator('supplierDes', {})(<Input disabled trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.materialDes`).d('物料描述')}
            >
              {getFieldDecorator('materialDes', {})(<Input disabled />)}
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
              label={intl.get(`${commonModelPrompt}.poNumber`).d('采购订单号')}
            >
              {getFieldDecorator('poNumber', {})(<Input trim />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.expectedArrivalTimeStart`).d('预计送达时间从')}
            >
              {getFieldDecorator(
                'expectedArrivalTimeStart',
                {}
              )(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('expectedArrivalTimeEnd') &&
                    moment(getFieldValue('expectedArrivalTimeEnd')).isBefore(currentDate, 'second')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${commonModelPrompt}.expectedArrivalTimeEnd`).d('预计送达时间至')}
            >
              {getFieldDecorator(
                'expectedArrivalTimeEnd',
                {}
              )(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format={getDateFormat()}
                  disabledDate={currentDate =>
                    getFieldValue('expectedArrivalTimeStart') &&
                    moment(getFieldValue('expectedArrivalTimeStart')).isAfter(currentDate, 'second')
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
              label={intl.get(`${commonModelPrompt}.siteId`).d('接收工厂')}
            >
              {getFieldDecorator('siteId', {
                initialValue: defaultSite.siteId,
              })(
                <Lov
                  code="MT.SITE"
                  textValue={form.getFieldValue('siteName') || defaultSite.siteName}
                  queryParams={{ tenantId }}
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      siteName: records ? records.siteName : '',
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('siteName', {
                initialValue: defaultSite.siteName,
              })(<Input trim />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FilterForm;
