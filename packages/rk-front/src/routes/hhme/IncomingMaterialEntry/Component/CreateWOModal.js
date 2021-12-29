/* eslint-disable radix */
/*
 * @Description: 创建wo模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-13 16:23:28
 * @LastEditTime: 2020-10-12 11:02:25
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Spin, Select, Row, Col, DatePicker, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_2_LAYOUT } from 'utils/constants';
import Lov from 'components/Lov';
import moment from 'moment';
import { connect } from 'dva';
import notification from 'utils/notification';
import styles from '../index.less';

@connect(({ incomingMaterialEntry }) => ({
  incomingMaterialEntry,
}))
@Form.create({ fieldNameProp: null })
export default class CreateWOModal extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      incomingforminputNumber: 'incoming-forminput-number-red',
    };
  }

  componentDidMount() {
  }



  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.cosNum && fieldsValue.remainingQty && fieldsValue.unitQty && parseInt(fieldsValue.cosNum) / parseInt(fieldsValue.unitQty) === fieldsValue.barNum) {
          onOk(fieldsValue);
        } else {
          notification.warning({ message: '请计算工单来料芯片数、剩余芯片数量、单元芯片数' });
        }
      }
    });
  }

  @Bind()
  onEnterDown(e) {
    const { form } = this.props;
    const { getFieldValue, setFieldsValue } = form;
    if (e.keyCode === 13) {
      this.setState({ incomingforminputNumber: 'incoming-forminput-number-yellow' });
      setFieldsValue({
        cosNum: getFieldValue('barNum') * getFieldValue('unitQty'),
      });
    }
  }

  @Bind()
  onChange() {
    this.setState({ incomingforminputNumber: 'incoming-forminput-number-red' });
  }

  // 选中一条工单
  @Bind()
  selectWo(val) {
    const { selectWo } = this.props;
    selectWo(val);
  }

  // 更改cos类型查询
  @Bind()
  changeCosType(val) {
    const { changeCosType } = this.props;
    changeCosType(val);
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      visible,
      lovData,
      onCancel,
      tenantId,
      workcellInfo = {},
      remainingQty,
      // incomingQty,
      unitQty,
      woWithCosType,
      createOrEdit,
      woRecord,
    } = this.props;
    const {
      containerType = [],
      cosType = [],
    } = lovData;
    const { incomingforminputNumber } = this.state;
    return (
      <Modal
        destroyOnClose
        width={600}
        title={createOrEdit === 'CREATE' ? '工单创建' : '工单修改'}
        visible={visible}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName={styles['enter-modal']}
      >
        <Spin spinning={false}>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="工单号" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('workOrderId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '工单号',
                        }),
                      },
                    ],
                    initialValue: woRecord.workOrderId,
                  })(
                    <Lov
                      code="HME.WO_JOB_SN"
                      queryParams={{
                        tenantId,
                        operationId: workcellInfo.operationId,
                        prodLineId: workcellInfo.prodLineId,
                      }}
                      onChange={() => {
                        setFieldsValue({
                          containerTypeCode: '',
                        });
                        const { dispatch } = this.props;
                        dispatch({
                          type: 'incomingMaterialEntry/updateState',
                          payload: {
                            remainingQty: '',
                            incomingQty: '',
                          },
                        });
                      }}
                      textValue={woRecord.workOrderNum}
                      onOk={val => this.selectWo(val)}
                      disabled={createOrEdit==='EDIT'}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('cosType', {
                    initialValue: woRecord.cosType ? woRecord.cosType : woWithCosType,
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: 'COS类型',
                        }),
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      // allowClear
                      disabled={!getFieldValue('containerTypeCode') || !getFieldValue('workOrderId')||createOrEdit==='EDIT'}
                      onChange={this.changeCosType}
                    >
                      {cosType.map(item => {
                        return (
                          <Select.Option value={item.value} key={item.value}>
                            {item.meaning}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="容器类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('containerTypeCode', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '容器类型',
                        }),
                      },
                    ],
                    initialValue: woRecord.containerTypeCode,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      disabled={createOrEdit==='EDIT'}
                      onChange={val => {
                        const { dispatch } = this.props;
                        if (getFieldValue('cosType')) {
                          dispatch({
                            type: 'incomingMaterialEntry/changeCosType',
                            payload: {
                              operationId: workcellInfo.operationId,
                              workOrderId: getFieldValue('workOrderId'),
                              containerTypeCode: val,
                              barNum: getFieldValue('barNum'),
                              cosType: getFieldValue('cosType'),
                            },
                          });
                        }
                      }}
                    >
                      {containerType.map(item => {
                        return (
                          <Select.Option value={item.containerTypeCode} key={item.containerTypeCode}>
                            {item.containerTypeDescription}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="Wafer" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('wafer', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: 'Wafer',
                        }),
                      },
                      {
                        validator: (rule, value, callback) => {
                          if (getFieldValue('wafer') && `${getFieldValue('wafer')}`.length > 15) {
                            callback(
                              'wafer长度不能大于15！'
                            );
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                    initialValue: woRecord.wafer,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="BAR条数" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('barNum', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: 'BAR条数',
                        }),
                      },
                    ],
                    initialValue: woRecord.barNum,
                  })(
                    <InputNumber
                      className={styles[`${incomingforminputNumber}`]}
                      onKeyDown={this.onEnterDown}
                      onChange={this.onChange}
                      min={0}
                      style={{ width: '100%', backgroundColor: 'red' }}
                      formatter={value => `${value}`}
                      parser={value => value.replace(/\D|^-/g, '')}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="LOTNO" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('lotNo', {
                    initialValue: woRecord.lotNo,
                  })(
                    <Input disabled={createOrEdit==='EDIT'} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="Avg λ[nm]" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('averageWavelength', {
                    initialValue: woRecord.averageWavelength,
                  })(
                    <Input disabled={createOrEdit==='EDIT'} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="TYPE" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('type', {
                    initialValue: woRecord.type,
                  })(
                    <Input disabled={createOrEdit==='EDIT'} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="备注" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('remark', {
                    initialValue: woRecord.remark,
                  })(
                    <Input disabled={createOrEdit==='EDIT'} />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="录入批次" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('jobBatch', {
                    initialValue: woRecord.jobBatch ? moment(woRecord.jobBatch, 'YYYY-MM-DD') : moment(moment().format('YYYY-MM-DD')),
                  })(
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      disabled={createOrEdit==='EDIT'}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="工单来料芯片数" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('cosNum', {
                    initialValue: woRecord.cosNum,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="剩余芯片数量" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('remainingQty', {
                    initialValue: woRecord.remainingQty ? woRecord.remainingQty : remainingQty,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_2_LAYOUT}>
                <Form.Item label="单元芯片数" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('unitQty', {
                    initialValue: unitQty,
                  })(
                    <Input disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
