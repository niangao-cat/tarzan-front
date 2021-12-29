import React, { Component } from 'react';
import { Form, Input, Row, Col, Tooltip } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import {
  DEBOUNCE_TIME,
  FORM_COL_2_LAYOUT,
} from 'utils/constants';
import styles from '../index.less';

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
      const fetchPlaInput = document.getElementById("fetchPlaInput");
      fetchPlaInput.focus();
      fetchPlaInput.select();
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
      checkInSiteLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className={styles['fetching-platform-top-left-form']}>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='投入芯片盒子'
            >
              {getFieldDecorator('materialLotCode')(
                <Input
                  id='fetchPlaInput'
                  onKeyDown={this.onEnterDown}
                  disabled={checkInSiteLoading}
                />)}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='Avg入[nm]'
            >
              {containerInfo.averageWavelength}
            </Form.Item>
          </Col>
        </Row>
        <Row>
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
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='工单号'
            >
              {containerInfo.workOrderNum}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='TYPE'
            >
              {containerInfo.type}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片类型'
            >
              {containerInfo.cosType}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='LOTNO'
            >
              {containerInfo.lotNo}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='来料数量'
            >
              {containerInfo.primaryUomQty}
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
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='录入批次'
            >
              {containerInfo.workingLot}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='库存批次'
            >
              {containerInfo.lot}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='备注'
            >
              <Tooltip title={containerInfo.remark}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {containerInfo.remark}
                </div>
              </Tooltip>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='芯片剩余数量：'
            >
              {containerInfo.surplusCosNum}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='可新增数量：'
            >
              {containerInfo.addNum}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='实验代码：'
            >
              {containerInfo.labCode}
            </Form.Item>
          </Col>
          <Col {...FORM_COL_2_LAYOUT}>
            <Form.Item
              {...formLayout}
              label='实验代码备注：'
            >
              {containerInfo.labRemark}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default BottomForm;
