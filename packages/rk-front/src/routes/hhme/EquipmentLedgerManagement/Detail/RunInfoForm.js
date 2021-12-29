/*
 * @Description: 执行信息
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 18:48:28
 */

import Lov from 'components/Lov';
import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'hzero-ui';
import {
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';

@Form.create({ fieldNameProp: null })
export default class RunInfoForm extends PureComponent {
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
      deviceDetail = {},
      equipmentStatus = [],
      editFlag,
      tenantId,
      applyType = [],
      equipmentManageModel = [],
      ledgerType= [],
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentCategory`).d('设备类别')}
              >
                {getFieldDecorator('equipmentCategory', {
                  initialValue: deviceDetail.equipmentCategory,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dealReason`).d('设备类别'),
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
                    code="HME.EQUIPMENT_CATEGORY"
                    textValue={deviceDetail.equipmentCategoryDes}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentStatus`).d('设备状态')}
              >
                {getFieldDecorator('equipmentStatus', {
                  initialValue: deviceDetail.equipmentStatus || 'KY',
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.equipmentStatus`).d('设备状态'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    {equipmentStatus.map(ele => (
                      <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dealNum`).d('处置单号')}
              >
                {getFieldDecorator('dealNum', {
                  initialValue: deviceDetail.dealNum,
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dealNum`).d('处置单号'),
                      }),
                    },
                  ],
                })(
                  <Input disabled={editFlag || (getFieldValue('equipmentStatus') !== 'BF')} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.dealReason`).d('处置原因')}
              >
                {getFieldDecorator('dealReason', {
                  initialValue: deviceDetail.dealReason,
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.dealReason`).d('处置原因'),
                      }),
                    },
                  ],
                })(
                  <Input disabled={editFlag || (getFieldValue('equipmentStatus') !== 'BF')} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.applyType`).d('应用类型')}
              >
                {getFieldDecorator('applyType', {
                  initialValue: deviceDetail.equipmentId ? deviceDetail.applyType : '2',
                })(
                  <Select allowClear disabled={editFlag}>
                    {applyType.map(ele => (
                      <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.attribute1`).d('管理模式')}
              >
                {getFieldDecorator('attribute1', {
                  initialValue: deviceDetail.attribute1,
                  rules: [
                    {
                      required: false,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.attribute1`).d('管理模式'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    {equipmentManageModel.map(ele => (
                      <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`attribute2`).d('台账类别')}
              >
                {getFieldDecorator('attribute2', {
                  initialValue: deviceDetail.ledgerType,
                })(
                  <Select allowClear disabled={editFlag}>
                    {ledgerType.map(ele => (
                      <Select.Option value={ele.value} key={ele.value}>{ele.meaning}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}
