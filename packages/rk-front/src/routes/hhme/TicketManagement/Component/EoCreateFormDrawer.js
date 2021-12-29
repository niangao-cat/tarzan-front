/*
 * @Description: eo创建
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-28 17:36:12
 * @LastEditTime: 2020-08-05 17:53:18
 */

import React, { Component } from 'react';
import { Input, Modal, Form, InputNumber, Tooltip, Icon, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { isInteger, isNumber } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.workshop.productionOrderMgt.model.productionOrderMgt';
const FormItem = Form.Item;

@connect(({ productionOrderMgt, loading }) => ({
  productionOrderMgt,
  loading: loading.effects['productionOrderMgt/saveEoCreateForm'],
}))
@Form.create()
export default class EoCreateFormDrawer extends Component {
  state = {
    // eslint-disable-next-line react/no-unused-state
    enableEoMantissa: false,
  };

  componentDidMount = () => {
    const { dispatch, workOrderId } = this.props;
    // 查找详细信息
    dispatch({
      type: 'productionOrderMgt/fetchEoCreateDetail',
      payload: {
        workOrderId,
      },
    });

    // 尾数处理方式
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'ORDER',
        typeGroup: 'EO_CREAT_MANTISSA_DEAL',
        type: 'eoMantissaOptions',
      },
    });

    // 控制方式
    dispatch({
      type: 'productionOrderMgt/fetchTypeSelectList',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'CONTROL_TYPE',
        type: 'controlTypeOptions',
      },
    });
  };

  saveForm = () => {
    const { form, workOrderId, snCreateSave } = this.props;
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        snCreateSave({
          workOrderId,
          eoCount: values.trxReleasedQty,
          trxReleasedQty: values.trxReleasedQty,
          unitQty: values.unitQty,
        });
      }
    });
  };

  // 下达数量变更
  trxReleasedQtyChange = value => {
    if (isNumber(value)) {
      this.setState(
        {
          stateTrxReleasedQty: value,
        },
        () => {
          this.validateMantissa();
          this.setEoCountNumber();
        }
      );
    }
  };

  // 单位EO数量变更
  unitQtyChange = value => {
    if (isNumber(value)) {
      this.setState(
        {
          stateUnitQty: value,
        },
        () => {
          this.validateMantissa();
          this.setEoCountNumber();
        }
      );
    }
  };

  //  尾数处理方式修改
  mantissaChange = value => {
    this.setState(
      {
        stateMantissa: value,
      },
      () => {
        this.setEoCountNumber(value);
      }
    );
  };

  //  尾数处理方式验证
  validateMantissa = () => {
    const { stateTrxReleasedQty, stateUnitQty } = this.state;
    const { form } = this.props;
    if ((!stateTrxReleasedQty && !stateUnitQty) || isInteger(stateTrxReleasedQty / stateUnitQty)) {
      this.setState(
        {
          // eslint-disable-next-line react/no-unused-state
          enableEoMantissa: false,
        },
        () => {
          form.setFieldsValue({
            mantissa: '',
          });
          // form.validateFields(['mantissa', 'unitQty'], { force: true });
        }
      );
    } else {
      this.setState(
        {
          // eslint-disable-next-line react/no-unused-state
          enableEoMantissa: true,
        },
        () => {
          // form.validateFields(['mantissa', 'unitQty'], { force: true });
        }
      );
    }
  };

  //  设置EO生成个数
  setEoCountNumber = () => {
    const { stateTrxReleasedQty, stateUnitQty, stateMantissa } = this.state;
    const { form } = this.props;
    if (stateTrxReleasedQty && stateUnitQty) {
      let eoCount = stateTrxReleasedQty % stateUnitQty;
      if (eoCount === 0) {
        eoCount = (stateTrxReleasedQty / stateUnitQty).toFixed();
      } else {
        eoCount = Math.floor(stateTrxReleasedQty / stateUnitQty);
        if (stateMantissa === 'LESS_AVERAGE') {
          eoCount += 1;
        } else {
          eoCount = Math.floor(eoCount);
        }
      }
      form.setFieldsValue({
        eoCount,
      });
    } else {
      form.setFieldsValue({
        eoCount: 0,
      });
    }
  };

  render() {
    const {
      visible,
      onCancel,
      form,
      type,
      buttonSendLoading,
      productionOrderMgt: { eoCreateDetail = {}, controlTypeOptions = [] },
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      workOrderNum,
      qty,
      releasedQty,
      maxQty,
      canQty,
      completeControlQty,
      completeControlType,
    } = eoCreateDetail;

    const filters = controlTypeOptions.filter(ctr => ctr.typeCode === completeControlType);
    let completeControlText = '';
    if (filters.length > 0) {
      completeControlText = filters[0].description;
    }

    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get(`${modelPrompt}.eoCreate`).d('EO创建')}
        visible={visible}
        onCancel={() => onCancel(type)}
        onOk={this.saveForm}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        confirmLoading={buttonSendLoading}
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.workOrderNum`).d('WO编码')}
          >
            {getFieldDecorator('workOrderNum', {
              initialValue: workOrderNum,
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.qty`).d('WO数量')}>
            {getFieldDecorator('qty', {
              initialValue: qty,
            })(<Input disabled />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.releasedAreadyQty`).d('已下达数量')}
          >
            {getFieldDecorator('releasedQty', {
              initialValue: releasedQty,
            })(<Input disabled />)}
          </FormItem>
          <Row>
            <Col>
              <FormItem
                {...DRAWER_FORM_ITEM_LAYOUT}
                label={intl.get(`${modelPrompt}.canQty`).d('可下达数量')}
              >
                {getFieldDecorator('canQty', {
                  initialValue: canQty,
                })(<Input disabled />)}
              </FormItem>
            </Col>
            <Col
              style={{
                display: 'inline-block',
                position: 'absolute',
                top: 10,
                right: -4,
              }}
            >
              <Tooltip
                placement="topLeft"
                title={intl
                  .get(`${modelPrompt}.infocircle`)
                  .d(
                    `生产指令完工限制类型为：${completeControlText}，完工限制值为：${completeControlQty}，最大下达数量为：${maxQty}，可下达数量=最大下达数量-已下达数量`
                  )}
              >
                <Icon
                  type="question-circle-o"
                  style={{
                    fontSize: 14,
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.releasedQty`).d('下达数量')}
          >
            {getFieldDecorator('trxReleasedQty', {
              rules: [
                {
                  required: true,
                  message: intl.get(`${modelPrompt}.splitMsg`).d('下达数量不能为空'),
                },
                {
                  validator: (rule, value, callback) => {
                    if (value > canQty) {
                      callback(
                        intl.get(`${modelPrompt}.notLessMsg`).d('下达数量不能大于可下达数量')
                      );
                    }
                    callback();
                  },
                },
              ],
            })(
              <InputNumber
                onChange={this.trxReleasedQtyChange}
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
              />
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.unitQty`).d('单位EO数量')}
          >
            {getFieldDecorator('unitQty', {
              initialValue: 1,
            })(
              <InputNumber
                onChange={this.unitQtyChange}
                min={0}
                style={{ width: '100%' }}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                disabled
              />
            )}
          </FormItem>
          {/* <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.mantissa`).d('尾数处理方式')}
          >
            {getFieldDecorator('mantissa', {
              rules: [
                {
                  required: enableEoMantissa,
                  message: intl.get(`${modelPrompt}.mantissaIsNotEmpty`).d('尾数处理方式不能为空'),
                },
              ],
            })(
              <Select
                style={{ width: '100%' }}
                onChange={this.mantissaChange}
                allowClear
                disabled={!enableEoMantissa}
              >
                {eoMantissaOptions.map(eo => {
                  return (
                    <Select.Option value={eo.typeCode} key={eo.typeCode}>
                      {eo.description}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </FormItem> */}
          {/* <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.eoCount`).d('EO生成个数')}
          >
            {getFieldDecorator('eoCount', {})(
              <InputNumber style={{ width: '100%' }} min={0} precision={0} disabled />
            )}
          </FormItem> */}
        </Form>
      </Modal>
    );
  }
}
