/*
 * @Description: 条码创建
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 11:45:56
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-16 16:17:38
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, InputNumber, Form, Input, Row, Col, Table, Button, Select, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
@connect(({ deliverQuery }) => ({
  tenantId: getCurrentOrganizationId(),
  deliverQuery,
}))
export default class NewBarcodeCreateDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  @Bind()
  handleOK() {
    const { form, onOk, rowInfo } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue, rowInfo);
        form.resetFields('primaryUomQty');
        form.setFieldsValue({
          createQty: null,
        });
      }
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      showBrcodeCreate,
      onCancel,
      form,
      rowInfo,
      selectedBarCodeRowKeys,
      onSelectRow,
      printBarCode,
      headRecord,
      barCodeList,
      barCodePagination,
      createLoading,
    } = this.props;
    const { getFieldDecorator } = form;
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        align: 'center',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={600}
        title="条码创建"
        visible={showBrcodeCreate}
        onCancel={() => onCancel(false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        onOk={this.handleOK}
        footer={[
          <Button key="back" onClick={() => onCancel(false)} icon="close">
            取消
          </Button>,
          <Button key="submit" type="primary" icon="plus" onClick={() => this.handleOK()}>
            创建
          </Button>,
          <Button key="submit" type="primary" icon="file" onClick={() => printBarCode()}>
            打印
          </Button>,
        ]}
      >
        <Spin spinning={createLoading}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="送货单号">
                  {getFieldDecorator('instructionDocNum', {
                    initialValue: headRecord.instructionDocNum,
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('instructionDocId', {
                    initialValue: headRecord.instructionDocId,
                  })}
                </Form.Item>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料编码">
                  {getFieldDecorator('materialCode', {
                    initialValue: rowInfo.materialCode,
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料描述">
                  {getFieldDecorator('materialName', {
                    initialValue: rowInfo.materialName,
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('materialId', {
                    initialValue: rowInfo.materialId,
                  })}
                </Form.Item>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="条码状态">
                  {getFieldDecorator('status', {
                    initialValue: 'NEW',
                  })(
                    <Select disabled>
                      {[{ value: 'NEW', meaning: '新建' }].map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="质量状态">
                  {getFieldDecorator('qualityStatus', {
                    initialValue: 'PENDING',
                  })(
                    <Select disabled>
                      {[{ value: 'PENDING', meaning: '待定' }].map(item => (
                        <Select.Option key={item.value}>{item.meaning}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="包装数量">
                  {getFieldDecorator('primaryUomQty', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.primaryUomQty`).d('包装数量'),
                        }),
                      },
                    ],
                    initialValue: rowInfo.primaryUomQty,
                  })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.uomName`).d('单位')}
                >
                  {getFieldDecorator('uomName', {
                    initialValue: rowInfo.uomName,
                  })(<Input disabled />)}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('primaryUomId', {
                    initialValue: rowInfo.uomId,
                  })}
                </Form.Item>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT}
                  label={intl.get(`${modelPrompt}.createQty`).d('条码张数')}
                >
                  {getFieldDecorator('createQty', {
                    initialValue: 1,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: intl.get(`${modelPrompt}.createQty`).d('条码张数'),
                        }),
                      },
                    ],
                  })(<InputNumber min={0} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Table
                  bordered
                  columns={columns}
                  dataSource={barCodeList}
                  pagination={barCodePagination}
                  rowSelection={{
                    selectedBarCodeRowKeys,
                    onChange: onSelectRow,
                  }}
                  rowKey="materialLotId"
                />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
