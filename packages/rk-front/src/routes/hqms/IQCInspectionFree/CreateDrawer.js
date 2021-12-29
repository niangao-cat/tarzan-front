/*
 * @Description: IQC免检创建
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-24 10:25:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { getCurrentLanguage } from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class CreateDrawer extends Component {
  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
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

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const { form, tenantId, detail, showCreateDrawer, onCancel, defaultSite, typeList } = this.props;
    const { getFieldDecorator, setFieldsValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title="IQC免检创建"
        visible={showCreateDrawer}
        // confirmLoading={saveLoading}
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
            label={intl.get(`${modelPrompt}.siteName`).d('工厂')}
          >
            {getFieldDecorator('siteName', {
              initialValue: defaultSite.siteName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="工厂" style={{ display: 'none' }}>
            {getFieldDecorator('siteId', {
              initialValue: defaultSite.siteId,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.siteName`).d('类型')}
          >
            {getFieldDecorator('exemptionType', {
              initialValue: defaultSite.exemptionType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '供应商地址',
                  }),
                },
              ],
            })(
              <Select allowClear>
                {typeList.map(e => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料编码">
            {getFieldDecorator('materialId', {
              initialValue: detail.materialId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialId`).d('物料编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="QMS.MATERIAL"
                queryParams={{ tenantId, local: getCurrentLanguage() }}
                onChange={(value, item) => {
                  setFieldsValue({
                    materialName: item.materialName,
                  });
                }}
                textValue={detail.materialCode}
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
            label={intl.get(`${modelPrompt}.supplierId`).d('供应商编码')}
          >
            {getFieldDecorator('supplierId', {
              initialValue: detail.supplierId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.supplierId`).d('供应商编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="MT.SUPPLIER"
                queryParams={{ tenantId, local: getCurrentLanguage() }}
                onChange={(value, item) => {
                  setFieldsValue({
                    supplierName: item.supplierName,
                  });
                }}
                textValue={detail.supplierCode}
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="供应商地址">
            {getFieldDecorator('supplierSiteId', {
              initialValue: detail.supplierSiteId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '供应商地址',
                  }),
                },
              ],
            })(
              <Lov
                disabled={!form.getFieldValue('supplierId')}
                code="QMS.SUPPLIER_SITE"
                queryParams={{
                  tenantId,
                  supplierId: form.getFieldValue('supplierId'),
                }}
                textValue={detail.supplierSiteName}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.exemptionFlag`).d('是否免检')}
          >
            {getFieldDecorator('exemptionFlag', {
              initialValue: detail.exemptionFlag,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '是否免检',
                  }),
                },
              ],
            })(
              <Select>
                <Select.Option key="Y" value="Y">
                  是
                </Select.Option>
                <Select.Option key="N" value="N">
                  否
                </Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('是否有效')}
          >
            {getFieldDecorator('enableFlag', {
              initialValue: detail.enableFlag,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '是否有效',
                  }),
                },
              ],
            })(
              <Select>
                <Select.Option key="Y" value="Y">
                  是
                </Select.Option>
                <Select.Option key="N" value="N">
                  否
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateDrawer;
