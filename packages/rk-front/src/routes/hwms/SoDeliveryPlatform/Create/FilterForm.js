import React from 'react';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Col, Row, Input, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import moment from 'moment';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

const modelPromt = 'tarzan.hmes.InventoryAllocation';

@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  // 渲染
  render() {
    // 获取整个表单
    const {
      form,
      defaultSite,
      headDetail,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='出货单号'>
              {getFieldDecorator('instructionDocNum', {
                initialValue: headDetail.instructionDocNum,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='工厂'>
              {getFieldDecorator('siteId', {
                initialValue: headDetail.siteId || defaultSite.siteId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '工厂',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.SITE"
                  queryParams={{ tenantId }}
                  textValue={headDetail.siteCode || defaultSite.siteCode}
                  onChange={(value, records) => {
                    form.setFieldsValue({
                      siteCode: records.siteCode,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('siteCode', {
                initialValue: headDetail.siteCode || defaultSite.siteCode,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='客户'>
              {getFieldDecorator('customerId', {
                initialValue: headDetail.customerId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '客户',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.CUSTOMER"
                  queryParams={{ tenantId }}
                  onChange={() => {
                    form.setFieldsValue({
                      customerSiteId: null,
                    });
                  }}
                  textValue={headDetail.customerCode}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='客户地点'>
              {getFieldDecorator('customerSiteId', {
                initialValue: headDetail.customerSiteId ? headDetail.customerSiteId : null,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '客户地点',
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.CUSTOMER_SITE"
                  queryParams={{ tenantId, customerId: getFieldValue('customerId') }}
                  disabled={!getFieldValue('customerId')}
                  textValue={headDetail.customerSiteCode ? headDetail.customerSiteCode : null}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='计划发货日期'>
              {getFieldDecorator('demandTime', {
                initialValue: headDetail.demandTime ? moment(headDetail.demandTime, 'YYYY-MM-DD') : null || moment(moment().format('YYYY-MM-DD')),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '计划发货日期',
                    }),
                  },
                ],
              })(
                <DatePicker
                  placeholder=""
                  style={{ width: '100%' }}
                  format='YYYY-MM-DD'
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='请求交货日期'>
              {getFieldDecorator('expectedArrivalTime', {
                initialValue: headDetail.expectedArrivalTime ? moment(headDetail.expectedArrivalTime, 'YYYY-MM-DD') : null || moment(moment().format('YYYY-MM-DD')),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '请求交货日期',
                    }),
                  },
                ],
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  format='YYYY-MM-DD'
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPromt}.remark`).d('备注')}
            >
              {getFieldDecorator('remark', {
                initialValue: headDetail.remark,
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
