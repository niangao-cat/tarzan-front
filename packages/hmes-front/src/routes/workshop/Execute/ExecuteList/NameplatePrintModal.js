// 打印模态框
import React, { Component, Fragment } from 'react';
import { Row, Col, Button, Modal, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import EditTable from 'components/EditTable';

const InputGroup = Input.Group;

export default class PrintModal extends Component {

  // 打印条码
  @Bind()
  printBarcode() {
    const { onPrintNameplateList } = this.props;
    if (onPrintNameplateList) {
      onPrintNameplateList();
    }
  }



  render() {
    const {
      visible,
      closeModal,
      loading,
      dataSource = [],
    } = this.props;
    const columns = [
      {
        title: 'EO标识',
        width: 20,
        dataIndex: 'eoNum',
      },
      {
        title: '异常编码',
        width: 100,
        dataIndex: 'exceptionCode',
        render: (value, record) =>
          ['create', 'update'].includes(record._status) ? (

            <InputGroup compact>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('ac', {
                  initialValue: record.ac,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: 'AC',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('dc', {
                  initialValue: record.dc,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: 'DC',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('pump', {
                  initialValue: record.pump,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '泵浦源',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('opticalCable', {
                  initialValue: record.opticalCable,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '输出光缆',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('aerPlugModel', {
                  initialValue: record.aerPlugModel,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '航插型号',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('hostComVer', {
                  initialValue: record.hostComVer,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '上位机版本',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('mainControlMod', {
                  initialValue: record.mainControlMod,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '主控板型号',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('mainControlProgram', {
                  initialValue: record.mainControlProgram,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '主控板程序',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('optModeControlModel', {
                  initialValue: record.optModeControlModel,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '光模控制板型号',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('optModeControlProgram', {
                  initialValue: record.optModeControlProgram,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '光模控制板程序',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('comBundleControlModel', {
                  initialValue: record.comBundleControlModel,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '合束控制板型号',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ width: '8%' }}>
                {record.$form.getFieldDecorator('comBundleControlProgram', {
                  initialValue: record.comBundleControlProgram,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '合束控制板型号',
                      }),
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </InputGroup>
          ) : (
            value
          ),
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={800}
        title={(
          <Fragment>
            <Row>
              <Col span={4}>
                <Button type="primary" onClick={this.printBarcode}>打印</Button>
              </Col>
            </Row>
          </Fragment>
        )}
        visible={visible}
        onCancel={closeModal}
        confirmLoading={loading}
        footer={null}
      >
        <EditTable
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 180 }}
          loading={loading}
          rowKey="eoId"
          bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
        />
      </Modal>
    );
  }
}
