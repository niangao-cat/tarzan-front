/*
 * @Description: 新增条码模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-24 19:43:02
 * @LastEditTime: 2021-01-07 10:46:06
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Row, Col, InputNumber, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
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
          if (!values.auSnRatio) {
            Modal.confirm({
              title: intl
                .get('hzero.common.message.confirm.auSnRatio')
                .d('金锡比为空，是否确认新增？'),
              onOk: () => {
                createBarCode(values);
              },
            });
          } else {
            createBarCode(values);
          }
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
      auSnRatio,
      queryQty,
      loading,
      materialLot,
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
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="热沉类型">
                {getFieldDecorator('lot', {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp("^[0-9a-zA-Z_]{1,}$"),
                      message: '热沉类型仅能输入数字或字母',
                    },
                  ],
                })(
                  <Input
                    typeCase="upper"
                    inputChinese={false}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="金锡比(%)">
                {getFieldDecorator('auSnRatio', {
                  initialValue: auSnRatio,
                })(
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="实验代码">
                {getFieldDecorator('labCode', {
                  initialValue: isEmpty(materialLot) ? null : materialLot.labCode,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="实验备注">
                {getFieldDecorator('labRemark', {
                  initialValue: isEmpty(materialLot) ? null : materialLot.labRemark,
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
