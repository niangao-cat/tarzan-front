/*
 * @Description: 输入工位谈框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-19 15:37:20
 */
import React, { Component } from 'react';
import { Modal, Form, Input, Spin, Button, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import styles from '../index.less';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;

@Form.create({ fieldNameProp: null })
export default class EnterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }



  // 输入工位并回车
  @Bind()
  enterSite() {
    const { enterSite, form } = this.props;
    if (enterSite) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          enterSite(values);
        }
      });
    }
  }

  // 关闭输入框
  @Bind()
  handleCloseTab() {
    closeTab(`/hmes/time-management-return`);
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      visible,
    } = this.props;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <Modal
        destroyOnClose
        width={400}
        title={intl.get('hmes.operationPlatform.view.message.title').d('工位')}
        visible={visible}
        footer={null}
        onCancel={this.handleCloseTab}
        wrapClassName={styles['enter-modal']}
      >
        <Spin spinning={loading}>
          <Form>
            <Row>
              <Col span={20}>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT_MAX} label="工位编码">
                  {getFieldDecorator('workcellCode', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${prefixModel}.workcellCode`).d('工位编码'),
                        }),
                      },
                    ],
                  })(
                    <Input placeholder="请扫描条码" autoFocus />
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Button
                    style={{
                      display: 'none',
                    }}
                    htmlType="submit"
                    onClick={() => this.enterSite()}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
