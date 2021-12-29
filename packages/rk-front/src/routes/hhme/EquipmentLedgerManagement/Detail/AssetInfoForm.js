/*
 * @Description: 资产信息
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 15:45:16
 */

import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Select } from 'hzero-ui';
import {
  EDIT_FORM_ROW_LAYOUT,
  FORM_COL_4_LAYOUT,
  EDIT_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import intl from 'utils/intl';

const modelPrompt = '';
const { Option } = Select;

@Form.create({ fieldNameProp: null })
export default class AssetInforForm extends PureComponent {
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
      assetClass = [],
      siteName = '',
      siteId = '',
      equipmentType = [],
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <React.Fragment>
        <Form>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.siteName`).d('组织')}
              >
                {getFieldDecorator('dealNum', {
                  initialValue: deviceDetail.siteName || siteName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {getFieldDecorator('dealNum', {
                  initialValue: deviceDetail.siteId || siteId,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentType`).d('设备类型')}
              >
                {getFieldDecorator('equipmentType', {
                  initialValue: deviceDetail.equipmentType,
                })(
                  <Select allowClear disabled={editFlag}>
                    {equipmentType.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assetEncoding`).d('资产编码')}
              >
                {getFieldDecorator('assetEncoding', {
                  initialValue: deviceDetail.assetEncoding,
                  rules: [
                    {
                      required: !getFieldValue('materialCategoryId'),
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.materialCode`).d('资产编码'),
                      }),
                    },
                  ],
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sapNum`).d('SAP流水号')}
              >
                {getFieldDecorator('sapNum', {
                  initialValue: deviceDetail.sapNum,
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>

            {/* <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.descriptions`).d('设备描述')}
              >
                {getFieldDecorator('descriptions', {
                  initialValue: deviceDetail.descriptions,
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col> */}
          </Row>
          <Row {...EDIT_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assetName`).d('资产名称')}
              >
                {getFieldDecorator('assetName', {
                  initialValue: deviceDetail.assetName,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.assetName`).d('资产名称'),
                      }),
                    },
                  ],
                })(
                  <Input disabled={editFlag} />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentConfig`).d('配置')}
              >
                {getFieldDecorator('equipmentConfig', {
                  initialValue: deviceDetail.equipmentConfig,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.equipmentBodyNum`).d('机身序列号')}
              >
                {getFieldDecorator('equipmentBodyNum', {
                  initialValue: deviceDetail.equipmentBodyNum,
                })(<Input disabled={editFlag} />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item
                {...EDIT_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.assetClass`).d('资产类别')}
              >
                {getFieldDecorator('assetClass', {
                  initialValue: deviceDetail.assetClass,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${modelPrompt}.assetClass`).d('资产类别'),
                      }),
                    },
                  ],
                })(
                  <Select allowClear disabled={editFlag}>
                    {assetClass.map(ele => (
                      <Option value={ele.value} key={ele.value}>{ele.meaning}</Option>
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
