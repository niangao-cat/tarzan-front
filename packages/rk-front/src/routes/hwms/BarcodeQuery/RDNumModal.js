/**
 * 创建条码
 *@date：2019/9/12
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getDateFormat, getCurrentLanguage } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class RDNumberModal extends Component {
  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const productDate = moment(fieldsValue.productDate).format(DEFAULT_DATETIME_FORMAT);
        const tempObj = {
          ...fieldsValue,
          productDate,
        };
        onOk(tempObj);
        form.resetFields();
      }
    });
  }

  /**
   * 生产日期变化时 批次号联动
   * @param dates
   * @param dateString
   */
  @Bind()
  handleDateChange(dates, dateString) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (!isEmpty(dateString)) {
      const date = dateString.replace(new RegExp('-', 'g'), '');
      setFieldsValue({
        lot: date,
      });
    } else {
      setFieldsValue({
        lot: '',
      });
    }
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
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const {
      form,
      tenantId,
      statusMap = [],
      qualityStatusMap = [],
      performanceLevel = [],
      reasonMap = [],
      saveLoading,
      detail,
      showCreateDrawer,
      onCancel,
      getSite,
    } = this.props;
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('hwms.barcodeQuery.view.message.createBarcode').d('条码创建')}
        visible={showCreateDrawer}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialLotCode`).d('条码号')}
          >
            {getFieldDecorator('materialLotCode', {
              initialValue: detail.materialLotCode,
            })(
              <Input
                disabled={detail.materialLotId}
                onChange={(e) => {
                  if(e.target.value !== undefined && e.target.value !== null && e.target.value !== ""){
                    form.setFieldsValue({
                      createQty: 1,
                    });
                  }else{
                    form.setFieldsValue({
                      createQty: 1,
                    });
                  }
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.siteName`).d('工厂')}
          >
            {getFieldDecorator('siteName', { initialValue: detail.siteName || getSite.siteName })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} style={{ display: 'none' }}>
            {getFieldDecorator('siteId', { initialValue: detail.siteId || getSite.siteId })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="仓库">
            {getFieldDecorator('warehouseId', {
              initialValue: detail.locatorCode,
            })(
              <Lov
                code="MT.WARE.HOUSE"
                queryParams={{ tenantId }}
                textField="wareHouseCode"
                textValue={detail.wareHouseCode}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item label="货位" {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('locatorId', {
              initialValue: detail.locatorCode,
              rules: [
                {
                  required: !detail.materialLotId,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '货位',
                  }),
                },
              ],
            })(
              <Lov
                code="WMS.MTL_LOCATOR"
                queryParams={{
                  tenantId,
                  parentLocatorId: this.props.form.getFieldValue('warehouseId'),
                }}
                textValue={detail.locatorCode}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.statusMeaning`).d('状态')}
          >
            {getFieldDecorator('status', {
              initialValue: detail.status,
            })(
              <Select disabled>
                {statusMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态')}
          >
            {getFieldDecorator('qualityStatus', {
              initialValue: detail.qualityStatus,
            })(
              <Select disabled={detail.materialLotId}>
                {qualityStatusMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialCode`).d('物料编码')}
          >
            {getFieldDecorator('materialId', {
              initialValue: detail.materialCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="HME.MATERIAL_NEW_SN"
                textValue={detail.materialCode}
                queryParams={{ tenantId, local: getCurrentLanguage(), siteId: getSite.siteId }}
                onChange={(value, item) => {
                  setFieldsValue({
                    materialName: item.materialName,
                    primaryUomId: item.uomId,
                    primaryUomName: item.uomName,
                  });
                }}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialName`).d('物料描述')}
          >
            {getFieldDecorator('materialName', {
              initialValue: detail.materialName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialVersion`).d('物料版本')}
          >
            {getFieldDecorator('materialVersion', {
              initialValue: detail.materialVersion,
            })(
              <Lov
                code="HME.MATERIAL_VERSION"
                queryParams={{
                  tenantId,
                  siteId: getSite.siteId,
                  materialId: detail.materialLotId ? detail.materialId : getFieldValue('materialId'),
                }}
                textValue={detail.materialVersion}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.lot`).d('批次')}
          >
            {getFieldDecorator('lot', {
              initialValue: detail.lot,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (getFieldValue('lot') && `${getFieldValue('lot')}`.length !== 10) {
                      callback(
                        '批次长度应为10！'
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <InputNumber
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                min={0}
                style={{ width: '100%' }}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.soNum`).d('销售订单')}
          >
            {getFieldDecorator('soNum', {
              initialValue: detail.soNum,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (getFieldValue('soNum') && `${getFieldValue('soNum')}`.length > 10) {
                      callback(
                        '销售订单长度不能大于10！'
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <Input
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.soLineNum`).d('销售订单行')}
          >
            {getFieldDecorator('soLineNum', {
              initialValue: detail.soLineNum,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if (getFieldValue('soLineNum') && `${getFieldValue('soLineNum')}`.length > 6) {
                      callback(
                        '销售订单行长度不能大于6！'
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <Input disabled={detail.materialLotId} />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.supplierCode`).d('供应商编码')}
          >
            {getFieldDecorator('supplierId', {
              initialValue: detail.supplierCode,
              rules: [{}],
            })(
              <Lov
                code="Z.SUPPLIER"
                textValue={detail.supplierCode}
                queryParams={{ tenantId, materialId: form.getFieldValue('materialId')? form.getFieldValue('materialId'): null}}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    supplierName: item.supplierName,
                  });
                }}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.supplierName`).d('供应商描述')}
          >
            {getFieldDecorator('supplierName', {
              initialValue: detail.supplierName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.supplierLot`).d('供应商批次')}
          >
            {getFieldDecorator('supplierLot', {
              initialValue: detail.supplierLot,

            })(
              <Input disabled={detail.materialLotId} />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.productDate`).d('生产日期')}
          >
            {getFieldDecorator('productDate', {
              rules: [
                {
                  required: !detail.materialLotId,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
                  }),
                },
              ],
              initialValue: detail.productDate && moment(detail.productDate, 'YYYY-MM-DD HH:mm:ss'),
            })(
              <DatePicker
                placeholder=""
                style={{ width: '100%' }}
                format={getDateFormat()}
                // onChange={(dates, dateString) => this.handleDateChange(dates, dateString)}
                disabledDate={currentDate => moment(new Date()).isBefore(currentDate, 'day')}
                disabled={detail.materialLotId}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.performanceLevel`).d('性能等级')}
          >
            {getFieldDecorator('performanceLevel', {
              initialValue: detail.performanceLevel,
            })(
              <Select disabled={detail.materialLotId}>
                {performanceLevel.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.primaryUomQty`).d('包装数量')}
          >
            {getFieldDecorator('primaryUomQty', {
              initialValue: 1,
            })(<InputNumber
              disabled
              style={{ width: '100%' }}
              min={0}
              formatter={value => `${value}`}
              parser={value => this.limitDecimals(value, 5)}
            />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.primaryUomName`).d('单位')}
          >
            {getFieldDecorator('primaryUomName', {
              initialValue: detail.primaryUomName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>{getFieldDecorator('primaryUomId')}</Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.createQty`).d('条码张数')}
          >
            {getFieldDecorator('createQty', {
              initialValue: detail.createQty,
              rules: [
                {
                  required: !detail.materialLotId,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.createQty`).d('条码张数'),
                  }),
                },
              ],
            })(<InputNumber disabled={detail.materialLotId || !isEmpty(form.getFieldValue("materialLotCode"))} min={0} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.createReason`).d('创建原因')}
          >
            {getFieldDecorator('createReason', {
              initialValue: detail.createReason,
              rules: [
                {
                  required: !detail.materialLotId,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.createReason`).d('创建原因'),
                  }),
                },
              ],
            })(
              <Select disabled={detail.materialLotId}>
                {reasonMap.map(item => (
                  <Select.Option key={item.genTypeId}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.prodLine`).d('产线')}
          >
            {getFieldDecorator('prodLineId', {
              initialValue: detail.prodLineId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.prodLine`).d('产线'),
                  }),
                },
              ],
            })(
              <Lov code="MT.PRODLINE" queryParams={{ tenantId }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default RDNumberModal;
