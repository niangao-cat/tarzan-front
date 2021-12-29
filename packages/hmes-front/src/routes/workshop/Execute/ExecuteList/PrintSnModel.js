// 打印模态框
import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import {
    SEARCH_FORM_CLASSNAME,
    SEARCH_FORM_ITEM_LAYOUT,
    SEARCH_FORM_ROW_LAYOUT,
  } from 'utils/constants';

@Form.create({ fieldNameProp: null })
export default class PrintSnModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        flag: true,
        flagOne: true,
    };
  }

  componentDidMount() {
  }

  @Bind
  pringtBarCode(){
    const { form } = this.props;
    form.validateFields((err, values) => {
        if (values.oldMaterialLotCode!== null && (values.newMaterialLotCode === null || values.newMaterialLotCode === undefined)){
          // 执行打印方法
          const { printSn } = this.props;
          printSn({printType: 8, eoNum: values.oldMaterialLotCode });
          form.resetFields([ 'oldMaterialLotCode' ]);
          const oldMaterialLotCodeDom = document.getElementsByClassName('old-material-lot-code');
          if(oldMaterialLotCodeDom.length > 0) {
          oldMaterialLotCodeDom[0].focus();
          }
        }
        if ((values.oldMaterialLotCode === null || values.oldMaterialLotCode === undefined) && values.newMaterialLotCode !== null ){
          // 执行打印方法
          const { printSn } = this.props;
          printSn({printType: 9, eoNum: values.newMaterialLotCode });
          form.resetFields([ 'newMaterialLotCode' ]);
          const oldMaterialLotCodeDom = document.getElementsByClassName('new-material-lot-code');
          if(oldMaterialLotCodeDom.length > 0) {
          oldMaterialLotCodeDom[0].focus();
          }
        }
    });

  }



  render() {
    const {
      form,
      visible,
      closeModal,
      loading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={800}
        // title={<Button type="primary" onClick={this.printBarcode}>打印</Button>}
        visible={visible}
        onCancel={closeModal}
        confirmLoading={loading}
        footer={null}
      >
        <Form className={SEARCH_FORM_CLASSNAME}>
          <span style={{fontSize: 'x-large'}}>模板:</span>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              {this.state.flagOne&&(
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="SN标签（40*40）">
                {getFieldDecorator('oldMaterialLotCode', {
                    rules: [
                        {
                        required: !getFieldValue('newMaterialLotCode'),
                        message: intl.get('hzero.common.validation.notNull', {
                            name: 'SN标签（40*40）',
                        }),
                        },
                    ],
                    })(<Input
                      disabled={getFieldValue('newMaterialLotCode')}
                      className="old-material-lot-code"
                      onChange={() => {
                        this.setState({flag: false}, ()=>{this.setState({flag: true});});
                      }}
                      trimAll
                    />)}
              </Form.Item>
              )}
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              {this.state.flag&&(
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="SN标签（45*30）">
                {getFieldDecorator('newMaterialLotCode', {
                      rules: [
                          {
                          required: !getFieldValue('oldMaterialLotCode'),
                          message: intl.get('hzero.common.validation.notNull', {
                              name: 'SN标签（45*30）',
                          }),
                          },
                      ],
                      })(<Input
                        disabled={getFieldValue('oldMaterialLotCode')}
                        className="new-material-lot-code"
                        onChange={() => {
                          this.setState({flagOne: false}, ()=>{this.setState({flagOne: true});});
                        }}
                        trimAll
                      />)}
              </Form.Item>
              )}
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Form.Item wrapperCol={{ span: 6 }} style={{textAlign: 'center'}}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={()=>this.pringtBarCode()}
                style={{width: '50%', marginLeft: '37%'}}
              >
                打印
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}
