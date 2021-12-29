/*
 * @Description: 目标卡片
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-12 10:33:30
 * @LastEditTime: 2020-10-10 20:33:52
 */

import React, { Component } from 'react';
import { Divider, Card, Form, Button, Input, Tooltip, InputNumber, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class BarCodeAndMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  /**
   * 表单校验
   */
  @Bind()
  targetConfirm() {
    const { targetConfirm, form, index } = this.props;
    if (targetConfirm) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          if (isEmpty(values.timeUom)) {
            return notification.error({ message: '时长类别不能为空！' });
          }
          if (!values.minute) {
            return notification.error({ message: '时效时长不能为空！' });
          }
          if (!values.qty) {
            return notification.error({ message: '分装数量不能为空！' });
          }
          targetConfirm(values, index);
        }
      });
    }
  }

  @Bind()
  printingBarcode() {
    const { printingBarcode, targetInfo } = this.props;
    if (printingBarcode) {
      if (targetInfo.targetMaterialLotId) {
        printingBarcode(targetInfo);
      } else {
        notification.error({ message: '请先生成目标条码！' });
      }
    }
  }

  // 删除数据
  @Bind()
  deleteTargetCard(val) {
    const { index, deleteTargetCard, form } = this.props;
    deleteTargetCard(val);
    // 判断索引是否相同，索引相同的则调用这
    if (index === val && index < 4) {
      form.resetFields();
    }
  }

  @Bind()
  onEnterDown(e) {
    const { form, sacnTargetCode, index } = this.props;
    if (e.keyCode === 13) {
      sacnTargetCode(form.getFieldValue('targetMaterialLotCode'), index);
    }
  }

  render() {
    const { form, targetInfo = {}, index, timeUom = [], confirmFlag, spinning } = this.props;
    return (
      <Card className={styles['barCodeAndMaterials-content']}>
        <Form style={{ paddingRight: '10px' }}>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="目标条码">
            {form.getFieldDecorator('targetMaterialLotCode', {
              initialValue: targetInfo.targetMaterialLotCode,
            })(<Input disabled={targetInfo.targetMaterialLotId} onKeyDown={this.onEnterDown} />)}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="物料名称">
            {form.getFieldDecorator('materialName', {})(
              <Tooltip title={targetInfo.materialName}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {targetInfo.materialName}
                </div>
              </Tooltip>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="SAP料号">
            {form.getFieldDecorator('materialCode', {})(
              <div>{targetInfo.materialCode}</div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="时长类别">
            {form.getFieldDecorator('timeUom', {
              initialValue: targetInfo.timeUom,
            })(
              <Select style={{ width: '100%' }} allowClear disabled={targetInfo.targetMaterialLotId}>
                {timeUom.map(item => {
                  return (
                    <Select.Option value={item.value} key={item.value}>
                      {item.meaning}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="时效时长">
            {form.getFieldDecorator('minute', {
              initialValue: targetInfo.minute,
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                disabled={targetInfo.targetMaterialLotId}
              />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="有效期从">
            {form.getFieldDecorator('targetDateTimeFrom', {})(
              <div>{targetInfo.targetDateTimeFrom}</div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="有效期至">
            {form.getFieldDecorator('targetDateTimeTo', {})(
              <div>{targetInfo.targetDateTimeTo}</div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商批次">
            {!spinning && form.getFieldDecorator('supplierLot', {
              initialValue: targetInfo.supplierLot,
            })(
              <Input disabled={targetInfo.targetMaterialLotId} />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="分装数量">
            {form.getFieldDecorator('qty', {
              initialValue: targetInfo.qty,
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}`}
                parser={value => this.limitDecimals(value, 5)}
                style={{ width: '100%' }}
                disabled={targetInfo.targetMaterialLotId}
              />
            )}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '9px 0', backgroundColor: '#45acf1' }} />
        <div style={{ textAlign: 'end' }}>
          <Button
            icon="delete"
            onClick={() => this.deleteTargetCard(index)}
            type="danger"
            disabled={targetInfo.targetMaterialLotId}
            style={{ marginRight: '6px' }}
          />
          <Button
            type="primary"
            ghost
            style={{ marginRight: '6px' }}
            onClick={() => this.printingBarcode()}
          // disabled
          >
            打印
          </Button>
          <Button
            type="primary"
            style={{ marginRight: '6px' }}
            onClick={() => this.targetConfirm()}
            disabled={targetInfo.targetMaterialLotId || confirmFlag}
          >
            确定
          </Button>
        </div>
      </Card>
    );
  }
}
