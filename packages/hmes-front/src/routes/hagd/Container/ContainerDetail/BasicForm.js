/**
 * BasicForm - 基础信息
 * date: 2019-12-5
 * @author: xubiting <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */

import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Input, InputNumber } from 'hzero-ui';
import { isNumber } from 'lodash';
import {
  FORM_COL_3_LAYOUT,
  SEARCH_FORM_ROW_LAYOUT,
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';
import { connect } from 'dva';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.hagd.containerType.model';

@formatterCollections({ code: 'tarzan.hagd.containerType.model' })
@connect(({ containerType }) => ({ containerType }))
@Form.create()
export default class BasicForm extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  setSize = (value, record, param) => {
    // 设置长度单位描述
    this.props.form.setFieldsValue({
      [param]: record.uomName,
    });
  };

  inputRequired = () => {
    const { form } = this.props;
    form.validateFields({ force: true });
  };

  render() {
    const {
      containerType: { containerItem = {} },
      canEdit,
      conFormRef,
    } = this.props;

    const {
      capacityQty,
      sizeUomId,
      sizeUomName,
      length,
      width,
      height,
      weight,
      weightUomId,
      weightUomName,
      maxLoadWeight,
      locationRow,
      locationColumn,
      weightUomCode,
      sizeUomCode,
      locationEnabledFlag,
    } = containerItem;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <Fragment>
        <Form>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.capacityQty`).d('最大装载数量')}
              >
                {getFieldDecorator('capacityQty', {
                  initialValue: capacityQty,
                })(
                  <InputNumber
                    precision={0}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sizeUomId`).d('长度单位')}
              >
                {getFieldDecorator('sizeUomId', {
                  initialValue: sizeUomId,
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          callback();
                        } else if (
                          isNumber(getFieldValue('length')) ||
                          isNumber(getFieldValue('width')) ||
                          isNumber(getFieldValue('height'))
                        ) {
                          callback(
                            intl.get(`${modelPrompt}.select`, {
                              name: intl.get(`${modelPrompt}.sizeUomId`).d('长度单位'),
                            })
                          );
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                })(
                  <Lov
                    code="MT.UOM"
                    queryParams={{ tenantId, uomType: 'LENGTH' }}
                    textValue={sizeUomCode}
                    disabled={!canEdit}
                    onChange={(value, record) => this.setSize(value, record, 'sizeUomName')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.sizeUomName`).d('长度单位描述')}
              >
                {getFieldDecorator('sizeUomName', {
                  initialValue: sizeUomName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.length`).d('容器长')}
              >
                {getFieldDecorator('length', {
                  initialValue: length,
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                    onChange={this.inputRequired}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.width`).d('容器宽')}
              >
                {getFieldDecorator('width', {
                  initialValue: width,
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                    onChange={value => this.inputRequired(value, 'width')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.height`).d('容器高')}
              >
                {getFieldDecorator('height', {
                  initialValue: height,
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                    onChange={value => this.inputRequired(value, 'height')}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weightUomId`).d('重量单位')}
              >
                {getFieldDecorator('weightUomId', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          callback();
                        } else if (isNumber(getFieldValue('weight'))) {
                          callback(
                            intl.get(`${modelPrompt}.select`, {
                              name: intl.get(`${modelPrompt}.weightUomId`).d('重量单位'),
                            })
                          );
                        } else {
                          callback();
                        }
                      },
                    },
                  ],
                  initialValue: weightUomId,
                })(
                  <Lov
                    code="MT.UOM"
                    queryParams={{ tenantId, uomType: 'WEIGHT' }}
                    textValue={weightUomCode}
                    onChange={(value, record) => this.setSize(value, record, 'weightUomName')}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weightUomName`).d('重量单位描述')}
              >
                {getFieldDecorator('weightUomName', {
                  initialValue: weightUomName,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.weight`).d('容器重量')}
              >
                {getFieldDecorator('weight', {
                  initialValue: weight,
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                    onChange={value => this.inputRequired(value, 'weight')}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_3_LAYOUT}>
              <Form.Item
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.maxLoadWeight`).d('最大承重数量')}
              >
                {getFieldDecorator('maxLoadWeight', {
                  initialValue: maxLoadWeight,
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    style={{ width: '100%' }}
                    disabled={!canEdit}
                  />
                )}
              </Form.Item>
            </Col>
            {locationEnabledFlag === 'Y' && (
              <Fragment>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...DRAWER_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.locationRow`).d('容器行')}
                  >
                    {getFieldDecorator('locationRow', {
                      initialValue: locationRow,
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            if (value) {
                              callback();
                            } else if (conFormRef) {
                              const locationEnabled = conFormRef.getFieldValue(
                                'locationEnabledFlag'
                              );
                              if (locationEnabled === 'Y') {
                                callback(
                                  intl.get(`${modelPrompt}.select`, {
                                    name: intl.get(`${modelPrompt}.locationRow`).d('容器行'),
                                  })
                                );
                              } else {
                                callback();
                              }
                            }
                          },
                        },
                      ],
                    })(
                      <InputNumber
                        precision={0}
                        min={1}
                        style={{ width: '100%' }}
                        disabled={!canEdit}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_3_LAYOUT}>
                  <Form.Item
                    {...DRAWER_FORM_ITEM_LAYOUT}
                    label={intl.get(`${modelPrompt}.locationColumn`).d('容器列')}
                  >
                    {getFieldDecorator('locationColumn', {
                      initialValue: locationColumn,
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            if (value) {
                              callback();
                            } else if (conFormRef) {
                              const locationEnabled = conFormRef.getFieldValue(
                                'locationEnabledFlag'
                              );
                              if (locationEnabled === 'Y') {
                                callback(
                                  intl.get(`${modelPrompt}.select`, {
                                    name: intl.get(`${modelPrompt}.locationColumn`).d('容器列'),
                                  })
                                );
                              } else {
                                callback();
                              }
                            }
                          },
                        },
                      ],
                    })(
                      <InputNumber
                        precision={0}
                        min={1}
                        style={{ width: '100%' }}
                        disabled={!canEdit}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Fragment>
            )}
          </Row>
        </Form>
      </Fragment>
    );
  }
}
