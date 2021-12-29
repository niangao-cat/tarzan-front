/*
 * @Description: 转移目标卡片配置页面
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-10 19:33:11
 * @LastEditTime: 2020-10-11 14:03:58
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber, Select } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { isFunction } from 'lodash';
import { Bind } from 'lodash-decorators';
@Form.create({ fieldNameProp: null })
export default class TargetCardConfig extends Component {

  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {
    };
  }

  @Bind()
  onEnterDown(e) {
    const { form, updateMaterialVersion } = this.props;
    if (e.keyCode === 13) {
      updateMaterialVersion(form.getFieldValue('materialVersion'));
    }
  }

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      expandDrawer,
      createTargetCard,
      createTargetCardFlag,
      form,
      supplierLot,
      timeUom,
    } = this.props;
    const { getFieldDecorator } = form;
    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={600}
        onCancel={() => createTargetCardFlag(false)}
        onOk={() => createTargetCard()}
        visible={expandDrawer}
        title="目标卡片配置"
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='生成张数'>
                {getFieldDecorator('number', {
                })(
                  <InputNumber
                    min={0}
                    formatter={value => `${value}`}
                    parser={value => value.replace(/\D|^-/g, '')}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='供应商批次'>
                {getFieldDecorator('supplierLot', {
                  initialValue: supplierLot,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='分装数量'>
                {getFieldDecorator('qty', {
                })(
                  <InputNumber
                    min={0}
                    formatter={value => `${value}`}
                    parser={value => this.limitDecimals(value, 5)}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='时长类别'>
                {getFieldDecorator('timeUom', {
                })(
                  <Select style={{ width: '100%' }} allowClear>
                    {timeUom.map(item => {
                      return (
                        <Select.Option value={item.value} key={item.value}>
                          {item.meaning}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='时效时长'>
                {getFieldDecorator('time', {
                })(
                  <InputNumber
                    min={0}
                    formatter={value => `${value}`}
                    parser={value => value.replace(/\D|^-/g, '')}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
