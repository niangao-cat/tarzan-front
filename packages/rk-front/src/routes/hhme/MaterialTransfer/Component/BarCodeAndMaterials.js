/*
 * @Description: 条码物料
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-16 16:08:00
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-23 14:26:47
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Divider, Card, Form, Button, Input, Tooltip, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isFunction } from 'lodash';
import { connect } from 'dva';
import uuid from 'uuid/v4';
import styles from '../index.less';

@connect(({ materialTransfer }) => ({
  materialTransfer,
}))
@Form.create({ fieldNameProp: uuid() })
export default class BarCodeAndMaterials extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (isFunction(this.props.onRef)) {
      const { index } = this.props;
      const value = {};
      value[`formCard${index}`] = this.props.form;
      this.props.onRef(value[`formCard${index}`]);
    }
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
  handleSubmit() {
    const { onSubmit, form, index } = this.props;
    if (onSubmit) {
      form.validateFields((err, values) => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSubmit(values, index);
        }
      });
    }
  }

  // 删除数据
  @Bind()
  deleteTargetCard(val) {
    const { deleteTargetCard, form } = this.props;
    deleteTargetCard(val);
    // 判断索引是否相同，索引相同的则调用这
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

  @Bind()
  printingBarcode() {
    const { printingBarcode, materialTransfersList } = this.props;
    if (printingBarcode) {
      if (materialTransfersList.targetMaterialLotId) {
        printingBarcode(materialTransfersList);
      } else {
        notification.error({ message: '请先生成目标条码！' });
      }
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
    const { form, materialTransfersList = {}, index, barCodeList, spinning } = this.props;
    return (
      <Card className={styles['barCodeAndMaterials-content']}>
        <Form style={{ paddingRight: '10px' }} key={uuid()}>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="目标编码">
            {!spinning && form.getFieldDecorator(`targetMaterialLotCode`, {
              initialValue: materialTransfersList.targetMaterialLotCode,
            })(<Input disabled={materialTransfersList.targetMaterialLotId} onKeyDown={this.onEnterDown} />)}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="物料名称">
            <Tooltip title={materialTransfersList.materialName}>
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {materialTransfersList.materialName}
              </div>
            </Tooltip>
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="SAP料号">
            {form.getFieldDecorator('materialCode', {})(
              <div>{materialTransfersList.materialCode}</div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="LOT">
            {form.getFieldDecorator('lot', {})(
              <div className={styles['barCodeAndMaterials-content-div']}>
                <Tooltip title={materialTransfersList.lot}>{materialTransfersList.lot}</Tooltip>
              </div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商">
            {form.getFieldDecorator('supplierName', {})(
              <Tooltip title={materialTransfersList.supplierName}>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {materialTransfersList.supplierName}
                </div>
              </Tooltip>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="供应商批次">
            {!spinning && form.getFieldDecorator('supplierLot', {
              initialValue: materialTransfersList.supplierLot,
            })(
              <Input disabled={materialTransfersList.targetMaterialLotId} />
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="单位">
            {form.getFieldDecorator('effectiveDate', {})(
              <div>{materialTransfersList.uomCode}</div>
            )}
          </Form.Item>
          <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="目标数量">
            {!spinning && form.getFieldDecorator(`targetQty`, {
              initialValue: materialTransfersList.targetQty,
            })(
              <InputNumber
                min={0}
                formatter={value => `${value}`}
                parser={value => this.limitDecimals(value, 5)}
                style={{ width: '100%' }}
                disabled={materialTransfersList.targetMaterialLotId}
              />
            )}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {!spinning && form.getFieldDecorator('uuid', {
              initialValue: materialTransfersList.uuid,
            })(<Input />)}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '9px 0', backgroundColor: '#45acf1' }} />
        <div style={{ textAlign: 'end' }}>
          <Button
            icon="delete"
            onClick={() => this.deleteTargetCard(index)}
            type="danger"
            disabled={materialTransfersList.targetMaterialLotId}
            style={{ marginRight: '6px' }}
          />
          <Button
            type="primary"
            ghost
            onClick={() => this.printingBarcode()}
            style={{ marginRight: '6px' }}
          >
            打印
          </Button>
          <Button
            style={{
              backgroundColor: materialTransfersList.targetMaterialLotId && '#ACB1BA',
              border: materialTransfersList.targetMaterialLotId && '1px solid #ACB1BA',
              color: materialTransfersList.targetMaterialLotId && '#333',
              marginRight: '6px',
            }}
            type="primary"
            disabled={materialTransfersList.targetMaterialLotId || barCodeList.length === 0}
            onClick={this.handleSubmit}
          >
            确定
          </Button>
        </div>
      </Card>
    );
  }
}
