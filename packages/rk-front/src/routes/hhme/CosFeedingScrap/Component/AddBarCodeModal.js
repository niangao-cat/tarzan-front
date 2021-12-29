/*
 * @Description: 新增条码模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-24 19:43:02
 * @LastEditTime: 2020-08-28 20:55:23
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Row, Col, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import styles from '../index.less';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;

@Form.create({ fieldNameProp: null })
export default class AddBarCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { onRef } = props;
    if (onRef) onRef(this);
  }

  componentDidMount() {
  }



  // 创建条码
  @Bind()
  createBarCode() {
    const { createBarCode, form } = this.props;
    if (createBarCode) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          createBarCode(values);
        }
      });
    }
  }


  render() {
    const {
      form: { getFieldDecorator },
      visible,
      addBarCode,
      containerType = [],
      qty,
      queryQty,
      loading,
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 16,
      },
    };
    return (
      <Modal
        destroyOnClose
        width={550}
        title='新增条码'
        visible={visible}
        onCancel={addBarCode}
        onOk={() => this.createBarCode()}
        wrapClassName={styles['enter-modal']}
        confirmLoading={loading}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="容器类型">
                {getFieldDecorator('containerTypeId', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.containerTypeId`).d('容器类型'),
                      }),
                    },
                  ],
                })(
                  <Select
                    onChange={queryQty}
                    style={{ width: '100%' }}
                    allowClear
                  >
                    {containerType.map(item => {
                      return (
                        <Select.Option value={item.containerTypeId} key={item.containerTypeId}>
                          {item.containerTypeDescription}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="盒数">
                {getFieldDecorator('boxTotal', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.boxTotal`).d('盒数'),
                      }),
                    },
                  ],
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
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="条码芯片数">
                {getFieldDecorator('qty', {
                  initialValue: qty,
                })(
                  <InputNumber
                    min={0}
                    max={qty}
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
