// 批次详情
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Select } from 'hzero-ui';
import { SEARCH_FORM_CLASSNAME, SEARCH_FORM_ROW_LAYOUT } from 'utils/constants';
import { Bind } from 'lodash-decorators';

const { Option } = Select;


@Form.create({ fieldNameProp: null })
export default class LeaveReason extends Component {

  @Bind
  doMatModal(){
    const { doMatModal, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        doMatModal(values);
      }
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      closeModal,
      visible,
      reasonList= [],
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    // 获取表单的字段属性
    return (
      <Modal
        destroyOnClose
        width={300}
        height={300}
        onCancel={()=>closeModal()}
        onOk={() => this.doMatModal()}
        visible={visible}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={24}>
              <Form.Item label="离岗原因">
                {getFieldDecorator(
                  'reason', {
                    rules: [
                      {
                        required: true,
                        message: '离岗原因',
                      },
                    ],
                  }
                )(
                  <Select style={{ width: '100%' }}>
                    {reasonList.map(ele => (
                      <Option value={ele.value}>{ele.meaning}</Option>
                  ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
