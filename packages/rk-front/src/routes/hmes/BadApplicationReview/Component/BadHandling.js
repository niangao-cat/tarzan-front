/*
 * @Description: 不良处理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-30 15:06:12
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-03-03 15:30:19
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Input, Row, Col, Radio, Button, Tooltip, Popconfirm, Checkbox } from 'hzero-ui';
import { Bind, Throttle } from 'lodash-decorators';
import { isFunction } from 'lodash';
import { Button as ButtonPermission } from 'components/Permission';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { DEBOUNCE_TIME, SEARCH_FORM_ROW_LAYOUT, SEARCH_FORM_ITEM_LAYOUT, FORM_COL_4_LAYOUT } from 'utils/constants';
import styles from '../index.less';
import MultipleLov from './MultipleLov/index';

// const formItemLayout = {
//   labelCol: {
//     span: 3,
//   },
//   wrapperCol: {
//     span: 14,
//   },
// };
const formItemLayoutComments = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@Form.create({ fieldNameProp: null })
class BadHandling extends Component {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
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
  submit() {
    const { submit, form } = this.props;
    if (submit) {
      form.validateFields((err, values) => {
        if (!err) {
          submit(values);
        }
      });
    }
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
  onChange(val) {
    const { form } = this.props;
    if (val.target.value !== 4) {
      form.setFieldsValue({
        transitionMaterialId: null,
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
      tenantId,
      record = {},
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <React.Fragment>
        <Form className={styles['bad-handling']}>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="生产线" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('prodLineName', {})(
                  <Tooltip title={record.prodLineName}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                    >
                      {record.prodLineName}
                    </div>
                  </Tooltip>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="工序" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('processName', {})(<span>{record.processName}</span>)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="提出工位">
                {getFieldDecorator('workcellName', {})(
                  <Tooltip title={record.workcellName}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                    >
                      {record.workcellName}
                    </div>
                  </Tooltip>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="操作者">
                {getFieldDecorator('userName', {})(<span>{record.userName}</span>)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="班次">
                {/* {getFieldDecorator('', {})()} */}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="产品类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                {/* {getFieldDecorator('', {})()} */}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="产品料号" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('materialCode', {})(<span>{record.materialCode}</span>)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="产品描述">
                {getFieldDecorator('materialName', {})(
                  <Tooltip title={record.materialName}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                    >
                      {record.materialName}
                    </div>
                  </Tooltip>)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="COS芯片位置">
                {getFieldDecorator('cosPosition', {})(
                  <span>{record.cosPosition}</span>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="COS芯片序列">
                {getFieldDecorator('chipSequence', {})(
                  <span>{record.chipSequence}</span>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="COS热沉ID">
                {getFieldDecorator('hotSinkCode', {})(
                  <span>{record.hotSinkCode}</span>
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label='材料料号'>
                {getFieldDecorator('scrapMaterialCode', {})(
                  <Tooltip title={record.scrapMaterialCode}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '100%',
                    }}
                    >
                      {record.scrapMaterialCode}
                    </div>
                  </Tooltip>)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="序列号">
                {getFieldDecorator('materialLotCode', {})(<span>{record.materialLotCode}</span>)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="工单">
                {getFieldDecorator('workOrderNum', {})(<span>{record.workOrderNum}</span>)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="状态">
                {getFieldDecorator('statusMeaning', {})(<span>{record.statusMeaning}</span>)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="责任人">
                {getFieldDecorator('responseUser', {})(<span>{record.responseUser}</span>)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="不良代码组">
                {getFieldDecorator('ncGroupId', {
                  initialValue: record.ncCodeId,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '不良代码组',
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                      rootCauseOperationId: record.rootCauseOperationId,
                    }}
                    disabled={record.status !== 'OPEN'}
                    textValue={record.ncGroupDesc}
                    allowClear
                    code="HME.NC_GROUP"
                    onChange={() => {
                      setFieldsValue({
                        ncCodeIdList: '',
                      });
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="不良代码" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('ncCodeIdList', {
                  initialValue: record.ncCodeIdList && record.ncCodeIdList.toString(),
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '不良代码',
                      }),
                    },
                  ],
                })(
                  <MultipleLov
                    code="HME.NC_RECORD_LOV"
                    queryParams={{
                      tenantId,
                      ncObjectId: getFieldValue('ncGroupId') || record.ncCodeId,
                    }}
                    textValue={record.ncCodeList && record.ncCodeList.toString()}
                    onChange={(value, item) => {
                      const arr = [];
                      item.forEach(ele => {
                        arr.push(ele.description);
                      });
                      form.setFieldsValue({
                        ncReason: arr,
                      });
                    }}
                    disabled={record.status !== 'OPEN'}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item label="不良原因" {...SEARCH_FORM_ITEM_LAYOUT}>
                {getFieldDecorator('ncReason', {
                  initialValue: record.ncReasonList,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
            <Col {...FORM_COL_4_LAYOUT}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="转型物料">
                {getFieldDecorator('transitionMaterialId', {
                  rules: [
                    {
                      required: getFieldValue('processMethod') === 4,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '转型物料',
                      }),
                    },
                  ],
                })(
                  <Lov
                    queryParams={{
                      tenantId,
                      eoId: record.eoId,
                    }}
                    disabled={record.status !== 'OPEN' || getFieldValue('processMethod') !== "4"}
                    textValue={record.transitionMaterialCode}
                    allowClear
                    code="HME.TRANSITION_MATERIAL"
                  />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item label="提交人备注" {...formItemLayoutComments}>
                {getFieldDecorator('comments', {
                  initialValue: record.comments,
                })(
                  <TextArea rows={4} disabled className={styles['more-fields-TextArea']} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="处理人备注" {...formItemLayoutComments}>
                {getFieldDecorator('comment', {
                  initialValue: record.disposeComment,
                })(
                  <TextArea disabled={record.status !== 'OPEN'} rows={4} className={styles['more-fields-TextArea']} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <Col span={12}>
              <Form.Item label="处理方式" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('processMethod', {
                  initialValue: record.disposeMethod,
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '处理方式',
                      }),
                    },
                  ],
                })(
                  <RadioGroup
                    disabled={record.status !== 'OPEN'}
                    onChange={val => this.onChange(val)}
                  >
                    {record.ncType === 'N' && (
                      <Radio
                        className={styles['more-fields-radio']}
                        value="1"
                      >
                        返修
                      </Radio>
                    )}
                    <Radio
                      className={styles['more-fields-radio']}
                      value="2"
                    >
                      放行
                    </Radio>
                    <Radio className={styles['more-fields-radio']} value="3">
                      报废
                    </Radio>
                    {record.ncType === 'N' && (
                      <Radio
                        className={styles['more-fields-radio']}
                        value="4"
                      >
                        降级转型
                      </Radio>
                    )}
                    {record.ncType === 'Y' && (
                      <Radio
                        className={styles['more-fields-radio']}
                        value="5"
                      >
                        退库
                      </Radio>
                    )}
                    {record.ncType === 'Y' && (
                      <Radio
                        className={styles['more-fields-radio']}
                        value="6"
                      >
                        自制件返修
                      </Radio>
                    )}
                    {record.ncType === 'N'&&!(getFieldValue('ncCodeIdList')&&getFieldValue('ncCodeIdList').split(',').length>1) && (
                      <Radio
                        className={styles['more-fields-radio']}
                        value="7"
                      >
                        指定工艺路线返修
                      </Radio>
                    )}
                  </RadioGroup>
                )}
              </Form.Item>
            </Col>
            {record.ncType === 'Y' && (getFieldValue('processMethod') === "2" || getFieldValue('processMethod') === "5" || record.barcode) ? (
              <Col span={12}>
                <Form.Item label="条码" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                  {getFieldDecorator('barcode', {
                    initialValue: record.barcode,
                  })(
                    <Input disabled={record.status !== 'OPEN'} />
                  )}
                </Form.Item>
              </Col>
            ) : ''}
            {record.ncType === 'N' && (getFieldValue('processMethod') === "1") ? (
              <Col span={6}>
                {/* <Form.Item label="处置组" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('routerId', {
                    initialValue: record.routerId,
                  })(
                    <Lov
                      queryParams={{
                        tenantId,
                        ncCodeIdList: getFieldValue('ncCodeIdList') && getFieldValue('ncCodeIdList'),
                      }}
                      disabled={record.status !== 'OPEN'}
                      textValue={record.dispositionFunction}
                      allowClear
                      code="HME.CHECK_DISPOSITION_GROUP"
                      onChange={(value, item) => {
                        form.setFieldsValue({
                          dispositionFunctionId: item.dispositionFunctionId,
                        });
                      }}
                    />
                  )}
                </Form.Item> */}
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('dispositionFunctionId', {
                    initialValue: record.dispositionFunctionId,
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
            ) : ''}
            {record.ncType === 'N' && (getFieldValue('processMethod') === "1") ? (
              <Col span={6}>
                <Form.Item label="返修记录" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                  {getFieldDecorator('reworkRecordFlag', {
                    initialValue: record.reworkRecordFlag,
                  })(
                    <Checkbox
                      checkedValue='Y'
                      unCheckedValue='N'
                    />
                  )}
                </Form.Item>
              </Col>
            ) : ''}
          </Row>
          <Row {...SEARCH_FORM_ROW_LAYOUT}>
            <div style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button
                  data-code="reset"
                  onClick={this.handleFormReset}
                  style={{ marginRight: '10px' }}
                  disabled={record.status !== 'OPEN'}
                >
                  {intl.get('hzero.common.button.reset').d('重置')}
                </Button>
                {getFieldValue('processMethod') === '3' ? (
                  <Popconfirm
                    title='是否确认报废？'
                    onConfirm={() => this.submit()}
                  >
                    <ButtonPermission
                      data-code="search"
                      type="primary"
                      htmlType="submit"
                      disabled={record.status !== 'OPEN'}
                      permissionList={[
                        {
                          code: 'hzero.hzero.hme.tarzan.nc.bad-application-review.ps.button.submit',
                          type: 'button',
                          meaning: '提交',
                        },
                      ]}
                    >
                      提交
                    </ButtonPermission>
                  </Popconfirm>
                ) : (
                  <ButtonPermission
                    onClick={() => this.submit()}
                    data-code="search"
                    type="primary"
                    htmlType="submit"
                    disabled={record.status !== 'OPEN'}
                    permissionList={[
                      {
                        code: 'hzero.hzero.hme.tarzan.nc.bad-application-review.ps.button.submit',
                        type: 'button',
                        meaning: '提交',
                      },
                    ]}
                  >
                    提交
                  </ButtonPermission>
                )}
              </Form.Item>
            </div>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

export default BadHandling;
