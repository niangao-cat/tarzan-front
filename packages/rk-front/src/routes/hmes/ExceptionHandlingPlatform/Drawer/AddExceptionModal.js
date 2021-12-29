/*
 * @Description: 新增异常
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-22 16:25:21
 */

import React, { Component } from 'react';
import { Modal, Row, Col, Form, Input, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import UploadModal from 'components/Upload/index';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import { decrypt } from '@/utils/utils';
import styles from '../index.less';
import scannerImageMat from '@/assets/scannerImageMat.png';
// import { Scrollbars } from 'react-custom-scrollbars';

const { TextArea } = Input;
@Form.create({ fieldNameProp: null })
export default class AddExceptionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  // 扫描设备
  @Bind()
  enterEquipment(modalType) {
    const { enterEquipment, form } = this.props;
    if (enterEquipment) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
          enterEquipment(values, modalType);
        }
      });
    }
  }

  @Bind()
  hideModal() {
    this.props.hideModal(false, false, '');
  }

  @Bind()
  handleOk(exceptionLabelListDetail){
    const { handleOk, form, modalType } = this.props;
    if (handleOk) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行enterSite
            handleOk(values, exceptionLabelListDetail, modalType);
        }
      });
    }
  }

  render() {
    const {
      exceptionModal,
      form,
      modalType,
      exceptionLabelListDetail = {},
      createExceptionRecordLoading,
    } = this.props;
    const formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <Modal
        title="异常提交"
        visible={exceptionModal}
        onOk={()=>this.handleOk(exceptionLabelListDetail)}
        onCancel={() => this.hideModal()}
        confirmLoading={createExceptionRecordLoading}
        okText="提交"
        cancelText="取消"
        className={styles['exception-model']}
        style={{ paddingBottom: '0px' }}
      >
        <Form className={styles['exception-model-form']}>
          <Row>
            <Col span={12}>
              <Form.Item {...formLayout} label="异常类型">
                {exceptionLabelListDetail.exceptionName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formLayout} label="班次">
                {exceptionLabelListDetail.shiftCode}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formLayout} label="组织关系">
                {exceptionLabelListDetail.workcellName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formLayout} label="操作者">
                {exceptionLabelListDetail.realName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="附件名称">
                {getFieldDecorator('attachmentUuid', {})(
                  <UploadModal
                    bucketName="file-mes"
                  // attachmentUUID={attachmentUuid}
                  // afterOpenUploadModal={this.afterOpenUploadModal}
                  // uploadSuccess={this.uploadSuccess}
                  // removeCallback={this.removeCallback}
                  // filesNumber={filesNumber}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          {modalType === 'EQUIPMENT' && (
            <Row>
              <Col>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="设备编码">
                  {getFieldDecorator('equipmentCode', {
                    rules: [
                      {
                        required: true,
                        message: '设备编码不能为空',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请扫描条码"
                      suffix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                      onPressEnter={e => {
                       form.setFieldsValue({equipmentCode: decrypt(e.target.value)});
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          {modalType === 'MATERIAL' && (
            <Row>
              <Col span={12}>
                <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="物料条码">
                  {getFieldDecorator('materialLotCode', {
                    rules: [
                      {
                        required: !getFieldValue('materialId'),
                        message: '物料条码不能为空',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请扫描条码"
                      suffix={<img style={{ width: '20px' }} src={scannerImageMat} alt="" />}
                      disabled={getFieldValue('materialId')}
                      onPressEnter={e => {
                        form.setFieldsValue({materialLotCode: decrypt(e.target.value)});
                       }}
                      onChange={() => {
                        setFieldsValue({
                          materialId: null,
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} label="物料编码">
                  {getFieldDecorator('materialId', {
                    rules: [
                      {
                        required: !getFieldValue('materialLotCode'),
                        message: '物料编码不能为空',
                      },
                    ],
                  })(
                    <Lov
                      code="QMS.MATERIAL"
                      disabled={getFieldValue('materialLotCode')}
                      queryParams={{ tenantId: getCurrentOrganizationId(), enableFlag: 'Y' }}
                      onChange={() => {
                        setFieldsValue({
                          materialLotCode: '',
                        });
                      }}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Form.Item
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                label="异常描述"
              >
                {getFieldDecorator('exceptionRemark', {
                })(
                  <TextArea
                    rows={4}
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  style={{
                    display: 'none',
                  }}
                  htmlType="submit"
                  onClick={() => this.enterEquipment(modalType)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
