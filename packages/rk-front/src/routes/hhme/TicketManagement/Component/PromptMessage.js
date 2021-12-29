/*
 * @Description: 提示消息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-02 09:24:15
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-02 09:41:57
 * @Copyright: Copyright (c) 2019 Hand
 */
import React from 'react';
import { Modal, Icon, Col, Row } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import styles from '../index.less';

export default class PromptMessage extends React.Component {
  // eslint-disable-next-line react/no-unused-state
  state = { visible: false };

  @Bind()
  handleOk() {
    const { buttonOnSubmit } = this.props;
    buttonOnSubmit();
  }

  @Bind()
  handleCancel() {
    const { handleCancel } = this.props;
    handleCancel();
  }

  render() {
    const { messageVisible, message } = this.props;
    return (
      <div>
        <Modal
          className={styles.changePasswordMessage}
          closable={false}
          visible={messageVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row gutter={5}>
            <Col span={3}>
              <Icon type="exclamation-circle" />
            </Col>
            <Col span={16}>
              <p>{message}</p>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
