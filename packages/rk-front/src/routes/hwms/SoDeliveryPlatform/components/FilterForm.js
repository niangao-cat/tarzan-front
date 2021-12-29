import React from "react";
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

@Form.create({ fieldNameProp: null })
export default class ErrorMessage extends React.PureComponent {

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
      form.validateFields((err) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch({});
        }
      });
    }
  }

  /**
   * 表单展开收起
   */
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  render() {
    const { handleSearch, form, statusMap, tenantId } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { expandForm } = this.state;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="出货单号">
              {getFieldDecorator('instructionDocNum', {})(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label='单据状态'
            >
              {getFieldDecorator('instructionDocStatus', {
              })(
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
              label='单据工厂'
            >
              {getFieldDecorator('siteId', {
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button onClick={() => this.toggleForm()}>
                {intl.get(`tarzan.calendar.working.button.viewMore`).d('更多查询')}
              </Button>
              <Button data-code="reset" onClick={() => this.handleFormReset()}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                onClick={() => handleSearch()}
                type="primary"
                htmlType="submit"
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='客户编码'>
                {getFieldDecorator('customerCode', {})(
                  <Lov
                    code="MT.CUSTOMER"
                    isInput
                    queryParams={{ tenantId }}
                    onChange={(val, item) => {
                      form.setFieldsValue({
                        customerCode: item ? item.customerCode : val,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='客户名称'>
                {getFieldDecorator('customerName', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='发货工厂'>
                {getFieldDecorator('fromSiteId', {})(
                  <Lov
                    code="MT.SITE"
                    queryParams={{ tenantId }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label='物料编码'
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('materialCode', {})(
                  <Lov
                    code="MT.MATERIAL"
                    isInput
                    queryParams={{ tenantId }}
                    onChange={(val, item) => {
                      form.setFieldsValue({
                        materialCode: item ? item.materialCode : val,
                      });
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='物料描述'>
                {getFieldDecorator('materialName', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='实物条码'>
                {getFieldDecorator('materialLotCode', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        {expandForm && (
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                label='销售订单号'
                {...SEARCH_FORM_ITEM_LAYOUT}
              >
                {getFieldDecorator('soNum', {})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='计划发货日期从'>
                {getFieldDecorator('expectDeliveryDateFrom', {})(
                  <DatePicker
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    disabledDate={currentDate =>
                      getFieldValue('expectDeliveryDateTo') &&
                      moment(getFieldValue('expectDeliveryDateTo')).isBefore(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='计划发货日期至'>
                {getFieldDecorator('expectDeliveryDateTo', {})(
                  <DatePicker
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    disabledDate={currentDate =>
                      getFieldValue('expectDeliveryDateFrom') &&
                      moment(getFieldValue('expectDeliveryDateFrom')).isAfter(currentDate, 'second')
                    }
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    );
  }
};

