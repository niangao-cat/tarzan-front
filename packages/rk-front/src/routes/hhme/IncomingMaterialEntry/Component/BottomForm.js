import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Tooltip } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';

const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
@Form.create({ fieldNameProp: null })
class BottomForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      expandForm: false,
    };
  }

  /**
   * 表单重置
   */
  @Bind()
  handleFormReset() {
    const { form } = this.props;
    form.resetFields();
  }

  /**
   * 表单校验
   */
  @Bind()
  bindMaterialWo() {
    const { bindMaterialWo, form } = this.props;
    if (bindMaterialWo) {
      form.validateFields(err => {
        if (!err) {
          bindMaterialWo();
          const materialLotCodeInput = document.querySelectorAll('#incomingMaterialLotCode')[0];
          materialLotCodeInput.focus();
          materialLotCodeInput.select();
        }
      });
    }
  }

  /**
   * 表单校验
   */
  @Bind()
  handleMoreSearch() {
    const { handleMoreSearch } = this.props;
    handleMoreSearch(true);
  }

  @Throttle(DEBOUNCE_TIME)
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  @Bind()
  onEnterDown(e) {
    const { form, scaneMaterialCode } = this.props;
    if (e.keyCode === 13) {
      scaneMaterialCode(form.getFieldsValue());
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const { form, materialContainerInfo, info } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='来料条码'
            >
              {getFieldDecorator('materialLotCode', {
                initialValue: info.materialLotCode,
              })(
                <Input
                  onKeyDown={this.onEnterDown}
                  id="incomingMaterialLotCode"
                  disabled={info.materialLotId}
                />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Avg入[nm]'
            >
              {getFieldDecorator('averageWavelength', {
              })(
                <span>{materialContainerInfo.averageWavelength}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片编码'
            >
              {getFieldDecorator('materialCode', {
              })(
                <Tooltip title={info.materialCode}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {info.materialCode}
                  </div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='LOTNO'
            >
              {getFieldDecorator('userVerification', {
              })(<span>{materialContainerInfo.lotNo}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片描述'
            >
              {getFieldDecorator('businessType', {
              })(
                <Tooltip title={info.materialName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {info.materialName}
                  </div>
                </Tooltip>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='TYPE'
            >
              {getFieldDecorator('tagGroupType', {
              })(
                <span>{materialContainerInfo.type}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片类型'
            >
              {getFieldDecorator('cosType', {
              })(
                <span>{materialContainerInfo.cosType}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Wafer'
            >
              {getFieldDecorator('userVerification', {
              })(<span>{materialContainerInfo.wafer}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='来料数量'
            >
              {getFieldDecorator('collectionTimeControl', {
              })(
                <span><span>{info.primaryUonQty}</span></span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='录入批次'
            >
              {getFieldDecorator('collectionTimeControl', {
              })(
                <span>{materialContainerInfo.jobBatch}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='备注'
            >
              {getFieldDecorator('remark', {
              })(<span>{materialContainerInfo.remark}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ textAlign: 'end' }}>
            <Button style={{ marginRight: '5px' }} data-code="reset" icon="reload" onClick={this.handleFormReset}>
              {intl.get('hzero.common.button.reset').d('重置')}
            </Button>
            <Button
              type="primary"
              onClick={() => this.bindMaterialWo()}
            >
              确认
            </Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default BottomForm;
