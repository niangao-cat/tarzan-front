/**
 * 库存调拨审核设置
 *@date：2019/10/18
 *@version：0.0.1
 */
import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const tenantId = getCurrentOrganizationId();

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
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.transactionType.model.transactionType';
    const { form, saveLoading, detail, showCreateDrawer, onCancel, approveSettingMap } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          isEmpty(detail.transactionTypeId)
            ? intl.get('hwms.transactionType.view.message.create').d('新建库存调拨审核设置')
            : intl.get('hwms.transactionType.view.message.edit').d('编辑库存调拨审核设置')
        }
        visible={showCreateDrawer}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.siteId`).d('工厂')}
          >
            {getFieldDecorator('siteId', {
              initialValue: detail.siteId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.fromLocatorId`).d('工厂'),
                  }),
                },
              ],
            })( <Lov
              code="MT.SITE"
              queryParams={{ tenantId }}
              textValue={detail.siteName}
            />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.fromLocatorId`).d('来源仓库')}
          >
            {getFieldDecorator('fromLocatorId', {
              initialValue: detail.fromLocatorId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.fromLocatorId`).d('来源仓库'),
                  }),
                },
              ],
            })( <Lov
              code="WMS.STOCK_LOCATOR"
              queryParams={{ tenantId }}
              textValue={detail.fromLocatorCode}
              onChange={(value, record) => { this.props.form.setFieldsValue({
              fromLocatorName: record.locatorName,
            });}}
            />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.fromLocatorName`).d('来源仓库描述')}
          >
            {getFieldDecorator('fromLocatorName', {
              initialValue: detail.fromLocatorName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.toLocatorId`).d('目标仓库')}
          >
            {getFieldDecorator('toLocatorId', {
              initialValue: detail.toLocatorId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.toLocatorId`).d('目标仓库'),
                  }),
                },
              ],
            })( <Lov
              code="WMS.STOCK_LOCATOR"
              queryParams={{ tenantId }}
              textValue={detail.toLocatorCode}
              onChange={(value, record) => { this.props.form.setFieldsValue({
              toLocatorName: record.locatorName,
            });}}
            />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.toLocatorName`).d('目标仓库描述')}
          >
            {getFieldDecorator('toLocatorName', {
              initialValue: detail.toLocatorName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.approveSetting`).d('审核要求')}
          >
            {getFieldDecorator('approveSetting', {
              initialValue: detail.approveSetting,
            })(
              <Select allowClear>
                {approveSettingMap.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
              ))}
              </Select>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateDrawer;
