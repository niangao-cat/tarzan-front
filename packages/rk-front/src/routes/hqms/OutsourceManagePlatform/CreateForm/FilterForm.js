/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建显示筛选）
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  SEARCH_FORM_CLASSNAME,
  FORM_COL_4_LAYOUT,
  FORM_FIELD_CLASSNAME,
  SEARCH_COL_CLASSNAME,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import Lov from 'components/Lov';
import moment from 'moment';
import { isFunction } from 'lodash';
import { getDateTimeFormat, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 表单创建
@Form.create({ fieldNameProp: null })
export default class FilterForm extends React.Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  // 查询方法
  @Bind
  createOutSourceData = () => {
    const { createOutSourceData, form } = this.props;
    form.validateFields((errs, values) => {
      if (!errs) {
        createOutSourceData(values);
      }
    });
  };

  // 渲染
  render() {
    // 获取整个表单
    const { form, docStatusMap, headData, reasonMap, changeReturnLocator } = this.props;

    // 获取表单的字段属性
    const { getFieldDecorator } = form;

    return (
      <Form className={SEARCH_FORM_CLASSNAME}>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`siteCode`).d('工厂')}
            >
              {getFieldDecorator('siteCode', {
                initialValue: headData.siteCode,
              })(
                <Input disabled />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`instructionDocNum`).d('单据')}
            >
              {getFieldDecorator('instructionDocNum', {
                initialValue: headData.instructionDocNum,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`instructionDocStatus`).d('单据状态')}
            >
              {getFieldDecorator('instructionDocStatus', {
                initialValue: "RELEASED",
              })(
                <Select allowClear disabled className={FORM_FIELD_CLASSNAME}>
                  {docStatusMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={this.createOutSourceData.bind(this)}>
                {intl.get(`hzero.common.button.save`).d('保存')}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`supplierId`).d('供应商')}
            >
              {getFieldDecorator('supplierId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`supplierId`).d('供应商'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="WMS.SUPPLIER"
                  textValue={headData.supplierName || null}
                  value={headData.supplierId || null}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`returnLocatorId`).d('收货仓库')}
            >
              {getFieldDecorator('returnLocatorId', {
              })(
                <Lov
                  code="WMS.WAREHOUSE_LOV"
                  queryParams={{ tenantId }}
                  onChange={(_, records) => changeReturnLocator(records)}
                />
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`returnArrivalTime`).d('到货时间')}
            >
              {getFieldDecorator('returnArrivalTime', {
                initialValue: moment(moment().format('YYYY-MM-DD HH:mm:ss')),
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`returnArrivalTime`).d('到货时间'),
                    }),
                  },
                ],
              })(
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  format={getDateTimeFormat()}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`remark`).d('备注')}
            >
              {getFieldDecorator('remark')(<Input />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_4_LAYOUT}>
            <Form.Item
              {...SEARCH_FORM_ITEM_LAYOUT}
              label={intl.get(`reason`).d('退料原因')}
            >
              {getFieldDecorator('reason', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`reason`).d('退料原因'),
                    }),
                  },
                ],
              })(
                <Select className={FORM_FIELD_CLASSNAME}>
                  {reasonMap.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.meaning}
                    </Select.Option>
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
