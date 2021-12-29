/**
 * 合并规则维护
 *@date：2019/10/21
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Modal, Input } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import MultipleLov from '../MultipleLov';

@Form.create({ fieldNameProp: null })
class MaintainDrawer extends Component {
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
    const modelPrompt = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const {
      tenantId,
      form,
      saveLoading,
      detail,
      visible,
      prodLineIdList,
      prodLineCodeList,
      onCancel,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('hwms.basicDataMaintain.view.message.createPrepare').d('合并规则维护')}
        visible={visible}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.site`).d('工厂')}>
            {getFieldDecorator('siteName', {
              initialValue: detail.siteName,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.site`).d('工厂'),
                  }),
                },
              ],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialCode`).d('物料')}
          >
            {getFieldDecorator('materialCode', {
              initialValue: detail.materialCode,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialCategory`).d('物料类型')}
          >
            {getFieldDecorator('materialCategoryCode', {
              initialValue: detail.materialCategoryCode,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.productionLine`).d('产线')}
          >
            {getFieldDecorator('prodLineIdList', {
              initialValue: prodLineIdList.toString(),
            })(
              <MultipleLov
                code="Z.PRODLINE"
                queryParams={{ tenantId, siteId: detail.siteId }}
                textValue={prodLineCodeList.toString()}
                textField="prodLineCodeList"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default MaintainDrawer;
