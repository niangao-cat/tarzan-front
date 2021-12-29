/*
 * @Description: 批次物料扫描
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-21 15:48:22
 * @LastEditTime: 2021-01-21 17:34:00
 */
import React, { Component } from 'react';
import { Form, Input, Row, Col, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

@Form.create({ fieldNameProp: null })
export default class LotMaterialForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
    };
  }

  componentDidMount() {
  }

  @Bind()
  onEnterDownCode(e) {
    const { form, cosScrapScanMaterialLot } = this.props;
    const { getFieldValue } = form;
    if (e.keyCode === 13) {
      if (cosScrapScanMaterialLot) {
        cosScrapScanMaterialLot(getFieldValue('sourceLotCode'));
      }
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form>
        <Row>
          <Col span={24}>
            <Form.Item label="批次物料" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              {getFieldDecorator('LotMaterialCode', {
              })(
                <Input
                  placeholder='请扫描条码'
                  suffix={<Icon type="enter" />}
                  onKeyDown={this.onEnterDownCode}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
