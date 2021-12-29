import React, { Component } from 'react';
import { Modal, Form, Spin, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';


@Form.create({ fieldNameProp: null })
export default class EnterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleCloseModal() {
    const { onCancel } = this.props;
    if(onCancel) {
      onCancel();
    }
  }

  @Bind()
  handleConfirm() {
    const { onConfirm } = this.props;
    if(onConfirm) {
      onConfirm();
    }
  }

  render() {
    const {
      loading,
      visible,
      dataSource,
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
        width={800}
        title='确认出站'
        visible={visible}
        footer={null}
        onCancel={this.handleCloseModal}
        onOk={this.handleConfirm}
      >
        <Spin spinning={loading}>
          <Form>
            <Row>
              {dataSource.map(e => (
                <Col span={12}>
                  <Form.Item
                    {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                    label={e.tagDescription}
                  >
                    {e.ncCodeDescription}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
