/*
 * @Description: 新增条码模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-24 19:43:02
 * @LastEditTime: 2020-10-30 09:25:00
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Row, Col, InputNumber, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import styles from '../index.less';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;

@Form.create({ fieldNameProp: null })
export default class AddBarCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }



  // 创建条码
  @Bind()
  createBarCode() {
    const { createBarCode, form, maxNumber } = this.props;
    if (createBarCode) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          // console.log(values)
          if (maxNumber >= values.actualChipNum) {
            createBarCode(values);
          } else {
            notification.error({ message: `实际装载芯片数不能大于${maxNumber}` });
          }
        }
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      type,
      addBarCode,
      containerType = [],
      fetchNcCode = [],
      loading,
      queryMaxNumber,
      maxNumber,
      info,
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
        width={600}
        title='新增条码'
        visible={visible}
        onCancel={() => addBarCode(type, false)}
        onOk={() => this.createBarCode()}
        wrapClassName={styles['enter-modal']}
        confirmLoading={loading}
      >
        <Form>
          <Row>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="容器类型">
                {getFieldDecorator('containerType', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.containerType`).d('容器类型'),
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    onChange={(val) => {
                      queryMaxNumber(val);
                    }}
                  >
                    {containerType.map(item => {
                      return (
                        <Select.Option value={item.containerTypeCode} key={item.containerTypeCode}>
                          {item.containerTypeDescription}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="条码数量">
                {getFieldDecorator('materialLotCount', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.materialLotCount`).d('条码数量'),
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
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="不良代码">
                {getFieldDecorator('ncCode', {
                  rules: [
                    {
                      required: type === 'NG',
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.ncCode`).d('不良代码'),
                      }),
                    },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    disabled={type === 'OK'}
                  >
                    {fetchNcCode.map(item => {
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
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="实际装载芯片数">
                {getFieldDecorator('actualChipNum', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: intl.get(`${prefixModel}.actualChipNum`).d('实际装载芯片数'),
                      }),
                    },
                  ],
                  initialValue: maxNumber,
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
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="实验代码">
                {getFieldDecorator('labCode', {
                  initialValue: info.labCode,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="实验代码备注">
                {getFieldDecorator('labRemark', {
                  initialValue: info.labRemark,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
