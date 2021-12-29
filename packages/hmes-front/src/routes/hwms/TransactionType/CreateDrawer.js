/**
 * 创建事务类型
 *@date：2019/10/18
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Input, Modal, Switch } from 'hzero-ui';
import intl from 'utils/intl';
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
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.transactionType.model.transactionType';
    const { form, saveLoading, detail, showCreateDrawer, onCancel } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          isEmpty(detail.transactionTypeId)
            ? intl.get('hwms.transactionType.view.message.create').d('新建事务类型')
            : intl.get('hwms.transactionType.view.message.edit').d('编辑事务类型')
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
            label={intl.get(`${modelPrompt}.transactionTypeCode`).d('事务类型编码')}
          >
            {getFieldDecorator('transactionTypeCode', {
              initialValue: detail.transactionTypeCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialCode`).d('事务类型编码'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.description`).d('事务类型描述')}
          >
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.moveType`).d('移动类型')}
          >
            {getFieldDecorator('moveType', {
              initialValue: detail.moveType,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.processErpFlag`).d('任务是否回传ERP')}
          >
            {getFieldDecorator('processErpFlag', {
              initialValue: detail.processErpFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
          >
            {getFieldDecorator('enableFlag', {
              initialValue: detail.enableFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateDrawer;
