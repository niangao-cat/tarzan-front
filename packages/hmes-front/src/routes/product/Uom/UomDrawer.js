/**
 * UomDrawer 单位编辑抽屉
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Select, Switch, InputNumber } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import TLEditor from '@/components/TLEditor';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const modelPrompt = 'tarzan.product.uom.model.uom';
const FormItem = Form.Item;

@Form.create({ fieldNameProp: null })
export default class UomDrawer extends React.PureComponent {
  @Bind()
  handleOK() {
    const { form, initData, onOk = e => e } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const enableFlag = fieldsValue.enableFlag ? 'Y' : 'N';
        const primaryFlag = fieldsValue.primaryFlag ? 'Y' : 'N';
        onOk({ ...initData, ...fieldsValue, enableFlag, primaryFlag });
      }
    });
  }

  render() {
    const { form, initData, visible, onCancel, uomTypeList, processModeList } = this.props;
    const {
      uomType,
      uomCode,
      uomName,
      primaryFlag,
      conversionValue,
      decimalNumber,
      processMode,
      enableFlag,
      uomId,
    } = initData;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.uomId
            ? intl.get('tarzan.product.uom.title.edit').d('编辑单位')
            : intl.get('tarzan.product.uom.title.create').d('新建单位')
        }
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.uomType`).d('单位类别')}
          >
            {getFieldDecorator('uomType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.uomType`).d('单位类别'),
                  }),
                },
              ],
              initialValue: uomType,
            })(
              <Select style={{ width: '100%' }} allowClear>
                {uomTypeList instanceof Array &&
                  uomTypeList.length !== 0 &&
                  uomTypeList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.uomCode`).d('单位编码')}
          >
            {getFieldDecorator('uomCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.uomCode`).d('单位编码'),
                  }),
                },
              ],
              initialValue: uomCode,
            })(<Input />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.uomName`).d('单位描述')}
          >
            {getFieldDecorator('uomName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.uomName`).d('单位描述'),
                  }),
                },
              ],
              initialValue: uomName,
            })(
              <TLEditor
                label={intl.get(`${modelPrompt}.uomName`).d('单位描述')}
                field="uomName"
                dto="tarzan.material.domain.entity.MtUom"
                pkValue={{ uomId: uomId || null }}
                inputSize={{ zh: 64, en: 64 }}
              />
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.primaryFlag`).d('是否主单位')}
          >
            {getFieldDecorator('primaryFlag', {
              initialValue: primaryFlag === 'Y',
            })(<Switch />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.conversionValue`).d('主单位换算')}
          >
            {getFieldDecorator('conversionValue', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.conversionValue`).d('主单位换算'),
                  }),
                },
                {
                  validator: (rule, value, callback) => {
                    if (value <= 0) {
                      callback(
                        intl.get(`${modelPrompt}.validation.moreThanZero`).d('主单位换算必须大于0!')
                      );
                    }
                    callback();
                  },
                },
              ],
              initialValue: conversionValue,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.decimalNumber`).d('小数位数')}
          >
            {getFieldDecorator('decimalNumber', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.decimalNumber`).d('小数位数'),
                  }),
                },
              ],
              initialValue: decimalNumber,
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.processMode`).d('尾数处理模式')}
          >
            {getFieldDecorator('processMode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.processMode`).d('尾数处理模式'),
                  }),
                },
              ],
              initialValue: processMode,
            })(
              <Select style={{ width: '100%' }} allowClear>
                {processModeList instanceof Array &&
                  processModeList.length !== 0 &&
                  processModeList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
          >
            {getFieldDecorator('enableFlag', {
              initialValue: enableFlag !== 'N',
            })(<Switch />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
