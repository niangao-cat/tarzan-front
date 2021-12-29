import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Tooltip, Select } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import {
  DEBOUNCE_TIME,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';

const formLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
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
      sourceContainer = {},
      autoAssignTransfer,
      autoAssignTransferNc,
      moveOver,
      loadingRules,
      autoAssignTransferLoading,
      autoAssignTransferNcLoading,
      moveOverLoading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Form>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='来料条码'
            >
              {getFieldDecorator('materialLotCode', {
                initialValue: sourceContainer.materialLotCode,
              })(<Input onKeyDown={this.onEnterDown} disabled={sourceContainer.materialLotCode} />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Avg入[nm]'
            >
              {sourceContainer.averageWavelength}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='物料编码'
            >
              <Tooltip title={sourceContainer.materialCode}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sourceContainer.materialCode}
                </div>
              </Tooltip>
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='TYPE'
            >
              {sourceContainer.incomingType}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='物料描述'
            >
              <Tooltip title={sourceContainer.materialName}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sourceContainer.materialName}
                </div>
              </Tooltip>
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='LOTNO'
            >
              {sourceContainer.lotno}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片类型'
            >
              {sourceContainer.cosType}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Wafer'
            >
              {sourceContainer.transWaferNum}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='来料数量'
            >
              {sourceContainer.releaseQty}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='录入批次'
            >
              {sourceContainer.releaseLot}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='工单号'
            >
              {sourceContainer.workOrderNum}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='备注'
            >
              {sourceContainer.remark}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='条码实验代码'
            >
              {sourceContainer.labCode}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='条码实验备注'
            >
              {sourceContainer.labRemark}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT} />
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='装载规则'
            >
              {getFieldDecorator('loadingRules', {
                initialValue: sourceContainer.loadingRules,
              })(
                <Select style={{ width: '100%' }}>
                  {loadingRules.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ textAlign: 'end' }}>
            <Button
              style={{ marginRight: '5px' }}
              loading={moveOverLoading}
              onClick={() => moveOver(sourceContainer, 'SOURCE')}
            >
              转移完成
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '5px' }}
              loading={autoAssignTransferLoading}
              onClick={() => autoAssignTransfer(getFieldValue('loadingRules'))}
            >
              自动分配
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '25px' }}
              loading={autoAssignTransferNcLoading}
              onClick={() => autoAssignTransferNc(getFieldValue('loadingRules'))}
            >
              不良自动分配
            </Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default BottomForm;
