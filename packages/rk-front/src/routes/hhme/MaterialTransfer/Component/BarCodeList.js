/*
 * @Description: 条码
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 15:49:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-23 09:33:22
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Button, Tooltip, InputNumber, Input, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isFunction } from 'lodash';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class BarCodeList extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
    this.state = {};
  }

  componentDidMount() { }

  // 提交数据
  @Bind()
  handleSubmit() {
    const { onCodeSubmit, form, barCode, index } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        // 如果验证成功,则执行onSearch
        onCodeSubmit(values, barCode, index);
      }
    });
  }

  render() {
    const { barCode = {}, deleteBarCode } = this.props;
    return (
      <div className={styles['barcode-content-info-material-transfer']}>
        <Row>
          <div style={{ float: 'left' }}>
            <div className={styles['barcode-content-info-orderSeq']}>{barCode.inputTimes}</div>
          </div>
          <div style={{ float: 'left', width: '390px' }}>
            <Form layout="inline" style={{ marginLeft: '6px' }}>
              <Row>
                <Col span={20}>
                  <Form.Item label="条码" style={{ marginLeft: '0px' }}>
                    <Tooltip title={barCode.materialLotCode}>
                      <div
                        style={{
                          width: '126px',
                          // overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >
                        {barCode.materialLotCode}
                      </div>
                    </Tooltip>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6} style={{ paddingTop: '4px' }}>
                  <Form.Item label="数量" style={{}}>
                    <Tooltip title={barCode.quantity + barCode.uomCode}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          width: '42px',
                        }}
                      >
                        {barCode.quantity} {barCode.uomCode}
                      </div>
                    </Tooltip>
                  </Form.Item>
                  <Form.Item style={{ display: 'none' }}>
                    {this.props.form.getFieldDecorator('inputTimes', {
                      initialValue: barCode.inputTimes,
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item label="转移数量">
                    {this.props.form.getFieldDecorator('transferQuantity', {
                      initialValue: barCode.transferQuantity,
                    })(<InputNumber />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item style={{ textAlign: 'end', width: '83%' }}>
                    <Button
                      icon="delete"
                      onClick={() => deleteBarCode(barCode)}
                      type="danger"
                      size="small"
                    />
                    <Button size="small" style={{ marginLeft: '8px' }} onClick={() => this.handleSubmit()}>
                      确定
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Row>
      </div>
    );
  }
}
