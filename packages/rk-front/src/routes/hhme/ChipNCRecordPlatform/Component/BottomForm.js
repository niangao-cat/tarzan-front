import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Tooltip } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
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
  handleSearch() {
    const { onSearch, form } = this.props;
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          onSearch();
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
    const {
      form,
      containerInfo = {},
      siteOutLoading,
      siteOut,
    } = this.props;
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
                initialValue: containerInfo.materialLotCode,
              })(<Input disabled={containerInfo.materialLotCode} onKeyDown={this.onEnterDown} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Avg入[nm]'
            >
              {getFieldDecorator('averageWavelength', {
              })(
                <span>{containerInfo.averageWavelength}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='物料编码'
            >
              {getFieldDecorator('materialCode', {
              })(
                <Tooltip title={containerInfo.materialCode}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {containerInfo.materialCode}
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
              {getFieldDecorator('type', {
              })(
                <span>{containerInfo.type}</span>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='物料描述'
            >
              {getFieldDecorator('materialName', {
              })(
                <Tooltip title={containerInfo.materialName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {containerInfo.materialName}
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
              {getFieldDecorator('lotNo', {
              })(<span>{containerInfo.lotNo}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='盒内总数'
            >
              {getFieldDecorator('collectionTimeControl', {
              })(
                <span>{containerInfo.primaryUomQty}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Wafer'
            >
              {getFieldDecorator('userVerification', {
              })(<span>{containerInfo.wafer}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='录入批次'
            >
              {getFieldDecorator('collectionTimeControl', {
              })(
                <span>{containerInfo.lot}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='备注'
            >
              {getFieldDecorator('userVerification', {
              })(<span>{containerInfo.remark}</span>)}
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
                <span>{containerInfo.cosType}</span>
              )}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='良品数'
            >
              {getFieldDecorator('okQty', {
              })(<span>{containerInfo.okQty}</span>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ textAlign: 'end' }}>
            <Button style={{ marginRight: '5px' }} data-code="reset" onClick={this.handleFormReset}>
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => siteOut()}
              loading={siteOutLoading}
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
