/*
 * @Description: 转移目标卡片配置页面
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-10 19:33:11
 * @LastEditTime: 2020-10-27 19:26:34
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'hzero-ui';
import {
  SEARCH_FORM_CLASSNAME,
  SEARCH_FORM_ROW_LAYOUT,
} from 'utils/constants';
import { isFunction } from 'lodash';
import notification from 'utils/notification';
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

  @Bind()
  changeSeralNumMax(number, serialNumber ){

    if(number>0&&(serialNumber!==null&&serialNumber!==""&&serialNumber!==undefined)){
      // 校验 输入的流水号
      const repex = /^[+]{0,1}(\d+)$/;
      if(!repex.test(serialNumber)){
       return notification.error("请输入整数流水号");
      }

      // 直接加入最后的数据
      const dataLength = serialNumber.length;

      // 转为数字
      const dataNumber = Number(serialNumber);

      // 自增

      const dataNewNumber = dataNumber+number-1;

      let dataNow = `${dataNewNumber}`;
      // 根据 新增的位数，与总长度求差值，取0
      for(let i=0; i<dataLength- `${dataNewNumber}`.length;i++){
        dataNow = `0${dataNow}`;
      }

      // 赋值 至数据
      this.props.form.setFieldsValue({
        serialNumberMax: dataNow,
      });
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
                    onChange={qty=>this.changeSeralNumMax(qty, this.props.form.getFieldValue('serialNumber'))}
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
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='目标数量'>
                {getFieldDecorator('targetQty', {
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
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} label='前缀'>
                {getFieldDecorator('prefix', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label='流水号'>
                {getFieldDecorator('serialNumber', {
                })(
                  <Input onChange={value=>this.changeSeralNumMax(this.props.form.getFieldValue('number'), value.target.value)} />
                )}
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('serialData', {
                })(
                  <span>~</span>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item wrapperCol={{ span: 24 }}>
                {getFieldDecorator('serialNumberMax', {
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
