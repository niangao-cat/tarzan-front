/*
 * @Description: 扩展信息
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:06:44
 * @LastEditTime: 2021-02-25 09:53:06
 */

import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, DatePicker, Select } from 'hzero-ui';
import { EDIT_FORM_ROW_LAYOUT, FORM_COL_4_LAYOUT, EDIT_FORM_ITEM_LAYOUT } from 'utils/constants';
import intl from 'utils/intl';
import moment from 'moment';
import Lov from 'components/Lov';

const { Option } = Select;
const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';

@Form.create({ fieldNameProp: null })
export default class ExtendedInfoForm extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      form,
      editFlag,
      deviceDetail = {},
      useFrequency = [],
      currency = [],
      tenantId,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.postingDate`).d('入账日期')}
              >
                {getFieldDecorator('postingDate', {
                  initialValue: deviceDetail.postingDate
                    ? moment(deviceDetail.postingDate, 'YYYY-MM-DD HH:mm:ss')
                    : null,
                })(<DatePicker disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.supplier`).d('销售商')}
              >
                {getFieldDecorator('supplier', {
                  initialValue: deviceDetail.supplier,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.brand`).d('品牌')}
              >
                {getFieldDecorator('brand', {
                  initialValue: deviceDetail.brand,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.model`).d('型号')}
              >
                {getFieldDecorator('model', {
                  initialValue: deviceDetail.model,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.unit`).d('单位')}
              >
                {getFieldDecorator('unit', {
                  initialValue: deviceDetail.unit,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.quantity`).d('数量')}
              >
                {getFieldDecorator('quantity', {
                  initialValue: deviceDetail.quantity,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.amount`).d('金额')}
              >
                {getFieldDecorator('amount', {
                  initialValue: deviceDetail.amount,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.currency`).d('币种')}
              >
                {getFieldDecorator('currency', {
                  initialValue: deviceDetail.currency,
                })(
                  <Select allowClear disabled={editFlag}>
                    {currency.map(ele => (
                      <Option value={ele.value} key={ele.value}>
                        {ele.value}-{ele.meaning}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.businessId`).d('保管部门')}
              >
                {getFieldDecorator('businessId', {
                  initialValue: deviceDetail.businessId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.businessId`).d('保管部门'),
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                    }}
                    disabled={editFlag}
                    allowClear
                    code="HME.BUSINESS_AREA"
                    textValue={deviceDetail.businessName}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.user`).d('使用人')}
              >
                {getFieldDecorator('user', {
                  initialValue: deviceDetail.user,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.preserver`).d('保管人')}
              >
                {getFieldDecorator('preserver', {
                  initialValue: deviceDetail.preserver,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.location`).d('存放地点')}
              >
                {getFieldDecorator('location', {
                  initialValue: deviceDetail.location,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.frequency`).d('使用频次')}
              >
                {getFieldDecorator('frequency', {
                  initialValue: deviceDetail.equipmentId ? deviceDetail.frequency : 'G',
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.frequency`).d('使用频次'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    {useFrequency.map(ele => (
                      <Option value={ele.value} key={ele.value}>
                        {ele.meaning}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.measureFlag`).d('是否计量')}
              >
                {getFieldDecorator('measureFlag', {
                  initialValue: deviceDetail.measureFlag || 'N',
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.measureFlag`).d('是否计量'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.contractNum`).d('合同编号')}
              >
                {getFieldDecorator('contractNum', {
                  initialValue: deviceDetail.contractNum,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.recruitement`).d('募投')}
              >
                {getFieldDecorator('recruitement', {
                  initialValue: deviceDetail.recruitement,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.recruitementNum`).d('募投编号')}
              >
                {getFieldDecorator('recruitementNum', {
                  initialValue: deviceDetail.recruitementNum,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.oaCheckNum`).d('OA验收单号')}
              >
                {getFieldDecorator('oaCheckNum', {
                  initialValue: deviceDetail.oaCheckNum,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.warrantyDate`).d('质保期到')}
              >
                {getFieldDecorator('warrantyDate', {
                  initialValue: deviceDetail.warrantyDate
                    ? moment(deviceDetail.warrantyDate, 'YYYY-MM-DD HH:mm:ss')
                    : null,
                })(<DatePicker disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.belongTo`).d('归属权')}
              >
                {getFieldDecorator('belongTo', {
                  initialValue: deviceDetail.belongTo,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.remark`).d('备注')}
              >
                {getFieldDecorator('remark', {
                  initialValue: deviceDetail.remark,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
