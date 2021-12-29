import React, { Component, Fragment } from 'react';
import { Form, Button, Input, Row, Col, Tooltip } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import intl from 'utils/intl';
import {
  DEBOUNCE_TIME,
  SEARCH_FORM_ROW_LAYOUT,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';
import { isEmpty } from 'lodash';

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
    const { form, scanMaterialCode } = this.props;
    if (e.keyCode === 13) {
      scanMaterialCode(form.getFieldsValue());
    }
  }

  @Bind()
  handleConfirm() {
    const { onConfirm, form } = this.props;
    if (onConfirm) {
      form.validateFields((err, values) => {
        if (!err) {
          onConfirm(values);
        }
      });
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
      selectInfo,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Row {...SEARCH_FORM_ROW_LAYOUT}>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='盒子号'
            >
              {getFieldDecorator('materialLotCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '盒子号',
                    }),
                  },
                ],
              })(<Input onKeyDown={this.onEnterDown} />)}
            </Form.Item>
          </Col>
          {!isEmpty(containerInfo) && (
            <Col {...FORM_COL_2_LAYOUT}>
              <Form.Item
                {...formLayout}
                label='芯片类型'
              >
                {containerInfo.cosType}
              </Form.Item>
            </Col>
          )}
        </Row>
        {!isEmpty(containerInfo) && (
          <Fragment>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='物料编码'
                >
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
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='Wafer'
                >
                  {containerInfo.wafer}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='物料描述'
                >
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
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='盒内总数'
                >
                  {containerInfo.primaryUomQty}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='条码实验代码'
                >
                  {containerInfo.barcodeLabCode}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item
                  {...formLayout}
                  label='条码实验备注'
                >
                  {containerInfo.barcodeLabRemark}
                </Form.Item>
              </Col>
            </Row>
            {!isEmpty(selectInfo) && (
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_2_LAYOUT}>
                  <Form.Item
                    {...formLayout}
                    label='芯片实验代码'
                  >
                    {getFieldDecorator('chipLabCode', {
                      initialValue: containerInfo.chipLabCode,
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '芯片实验代码',
                          }),
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_2_LAYOUT}>
                  <Form.Item
                    {...formLayout}
                    label='芯片实验备注'
                  >
                    {getFieldDecorator('chipLabRemark', {
                      initialValue: containerInfo.chipLabRemark,
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            )}
            {!isEmpty(selectInfo) && (
              <Row>
                <Form.Item style={{ textAlign: 'end' }}>
                  <Button
                    type="primary"
                    onClick={() => this.handleConfirm()}
                    loading={siteOutLoading}
                  >
                    确认
                  </Button>
                </Form.Item>
              </Row>
            )}
          </Fragment>
        )}
      </Form>
    );
  }
}

export default BottomForm;
