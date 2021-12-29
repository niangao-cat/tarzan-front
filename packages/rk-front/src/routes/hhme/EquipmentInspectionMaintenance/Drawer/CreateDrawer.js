/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:24:15
 */

import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class CreateBarcodeDrawer extends Component {
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
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const {
      form,
      detail,
      onCancel,
      visible,
      tenantId,
      drawerEditor,
      // serviceLife,
      equipemntManageType,
      saveHeadDataLoading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title="设备点检&保养项目维护"
        visible={visible}
        confirmLoading={saveHeadDataLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel({}, false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.siteName`).d('组织')}>
            {getFieldDecorator('siteName', {
              initialValue: detail.siteName,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} style={{ display: 'none' }}>
            {getFieldDecorator('siteId', { initialValue: detail.siteId })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="设备类别">
            {getFieldDecorator('equipmentCategory', {
              rules: [
                {
                  required: !getFieldValue('equipmentId'),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '设备类别',
                  }),
                },
              ],
              initialValue: detail.equipmentCategory,
            })(
              <Lov
                queryParams={{
                  tenantId,
                }}
                disabled={drawerEditor}
                allowClear
                code="HME.EQUIPMENT_CATEGORY"
                textValue={detail.equipmentCategoryMeaning}
              />
            )}
          </Form.Item>
          <Form.Item label='部门' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('businessId', {
              initialValue: detail.businessId,
            })(
              <Lov
                allowClear
                code="HME.BUSINESS_AREA"
                queryParams={{
                  tenantId,
                }}
                textValue={detail.businessName}
                disabled={drawerEditor}
              />
            )}
          </Form.Item>
          <Form.Item label='工艺' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('operationId', {
              initialValue: detail.operationId,
            })(
              <Lov
                allowClear
                code="MT.OPERATION"
                queryParams={{
                  tenantId,
                }}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    operationDesc: item.description,
                  });
                }}
                textValue={detail.operationName}
                disabled={drawerEditor||!getFieldValue('businessId')}
              />
            )}
          </Form.Item>
          <Form.Item label='工艺描述' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('operationDesc', {
              initialValue: detail.operationDescription,
            })(
              <Input disabled />
            )}
          </Form.Item>
          {/* <Form.Item label='使用年限' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('serviceLife', {
              initialValue: detail.serviceLife,
            })(
              <Select allowClear disabled={drawerEditor||!getFieldValue('businessId')}>
                {serviceLife.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item> */}
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.tagGroupId`).d('项目组编码')}>
            {getFieldDecorator('tagGroupId', {
              initialValue: detail.tagGroupId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '项目组编码不能为空',
                  }),
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                }}
                disabled={drawerEditor}
                allowClear
                code="MT.TAG_GROUP"
                textValue={detail.tagGroupCode}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    tagGroupDescription: item.tagGroupDescription,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.tagGroupDescription`).d('项目组描述')}
          >
            {getFieldDecorator('tagGroupDescription', {
              initialValue: detail.tagGroupDescription,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.manageType`).d('设备管理类型')}
          >
            {getFieldDecorator('manageType', {
              initialValue: detail.manageType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '设备管理类型不能为空',
                  }),
                },
              ],
            })(
              <Select allowClear disabled={drawerEditor}>
                {equipemntManageType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
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
              <Select allowClear>
                <Select.Option key='Y' value='Y'>是</Select.Option>
                <Select.Option key='N' value='N'>否</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateBarcodeDrawer;
