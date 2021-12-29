/**
 * 新建料站表行
 *@date：2019/11/5
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Modal, Input, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
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
    const modelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt2 = 'hwms.materialStation.model.materialStation';
    const modelPrompt3 = 'hwms.barcodeQuery.model.barcodeQuery';
    const { form, showCreateDrawer, onCancel, saveLoading, tenantId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('hzero.common.button.create').d('新建')}
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
            label={intl.get(`${modelPrompt2}.stance`).d('站位')}
          >
            {getFieldDecorator('stanceCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.stance`).d('站位'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.materialNumber`).d('料号')}
          >
            {getFieldDecorator('materialId2', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.materialNumber`).d('料号'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.MATERIAL_ID"
                queryParams={{ tenantId }}
                onChange={(value, record) => {
                  if (!isEmpty(value)) {
                    form.setFieldsValue({
                      materialName: record.materialName,
                    });
                  } else {
                    form.setFieldsValue({
                      materialName: '',
                    });
                  }
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt3}.materialName`).d('物料描述')}
          >
            {getFieldDecorator('materialName', {})(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.materialGunType`).d('料枪类型')}
          >
            {getFieldDecorator('materialGunType', {})(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.placeNumber`).d('位号')}
          >
            {getFieldDecorator('placeNumber', {})(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.consumption`).d('用量')}
          >
            {getFieldDecorator('consumption', {})(<InputNumber min={0} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateDrawer;
