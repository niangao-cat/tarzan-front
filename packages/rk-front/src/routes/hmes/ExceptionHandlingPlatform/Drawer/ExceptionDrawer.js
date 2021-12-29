/*
 * @Description: 异常明细抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-20 17:24:24
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-03-09 09:54:37
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Row, Col, Form, Timeline, Button, Popconfirm, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import UploadModal from 'components/Upload/index';
import styles from '../index.less';
// import { Scrollbars } from 'react-custom-scrollbars';

@Form.create({ fieldNameProp: null })
export default class ExceptionDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  @Bind()
  hideModal() {
    this.props.hideModal(false, false, '');
  }

  @Bind()
  closeException(val) {
    const { closeException } = this.props;
    closeException(val);
  }

  render() {
    const { exceptioListVisible, form, modalType, exceptionRecord, closeExceptionLoading, exceptionStatus } = this.props;
    const formLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="异常处理"
        visible={exceptioListVisible}
        className={styles['exception-model']}
        style={{ paddingBottom: '0px' }}
        onCancel={() => this.hideModal()}
        footer={[
          <Button key="back" onClick={() => this.hideModal()} style={{ marginLeft: '5px' }}>取消</Button>,
          <Popconfirm
            title="是否确认关闭当前异常？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => this.closeException(exceptionRecord)}
            type="primary"
          >
            <Button disabled={exceptionStatus === 'CLOSE'} loading={closeExceptionLoading} key="back">异常关闭</Button>
          </Popconfirm>,
        ]}
      >
        <Form className={styles['exception-model-form']}>
          <Row>
            <Col span={12}>
              <Form.Item {...formLayout} label="异常类型">
                <Tooltip title={exceptionRecord.exceptionName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >{exceptionRecord.exceptionName}
                  </div>
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formLayout} label="班次">
                {exceptionRecord.shiftCode}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...formLayout} label="组织关系">
                <Tooltip title={exceptionRecord.workcellName}>
                  <div
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >{exceptionRecord.workcellName}
                  </div>
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formLayout} label="操作者">
                {exceptionRecord.realName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="附件名称">
                {getFieldDecorator('workOrderNum', {})(
                  <UploadModal
                    bucketName="file-mes"
                    btnText="附件预览"
                    viewOnly
                    icon="paper-clip"
                    attachmentUUID={exceptionRecord.attachmentUuid}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          {modalType === 'EQUIPMENT' && (
            <Row>
              <Col>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="设备编码">
                  {getFieldDecorator('workOrderNum', {})(
                    <span>{exceptionRecord.equipmentCode}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          {modalType === 'MATERIAL' && (
            <Row>
              <Col span={12}>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="物料条码">
                  {getFieldDecorator('workOrderNum', {})(
                    <span>{exceptionRecord.materialLotCode}</span>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="物料编码">
                  {getFieldDecorator('workOrderNum', {})(
                    <span>{exceptionRecord.materialCode}</span>
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row>
            <Col>
              <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="异常描述">
                {exceptionRecord.exceptionRemark}
              </Form.Item>
            </Col>
          </Row>
          <Timeline style={{ padding: '7px, 20px', height: `${exceptionRecord.statusHistoryList * 35}px` }}>
            {exceptionRecord.statusHistoryList.map(item => {
              return <Timeline.Item>{item.creationDate}&nbsp;&nbsp;{item.exceptionStatusMeaning}&nbsp;&nbsp;{item.realName}</Timeline.Item>;
            })}
          </Timeline>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label="异常处理结果"
            style={{ paddingLeft: '10px' }}
          >
            {this.props.form.getFieldDecorator('result', {
            })(
              <span>{exceptionRecord.respondRemark}</span>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
