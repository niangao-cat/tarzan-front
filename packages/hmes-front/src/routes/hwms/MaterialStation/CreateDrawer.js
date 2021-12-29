/**
 * 新建料站表头
 *@date：2019/11/5
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Modal, Input, Select } from 'hzero-ui';
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
    const { form, showCreateDrawer, onCancel, materialTypeMap, saveLoading, tenantId } = this.props;
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.site`).d('工厂')}>
            {getFieldDecorator('siteCode', {})(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.lineBody`).d('线体')}
          >
            {getFieldDecorator('prodLineCode', {})(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.primaryMaterialNumber`).d('主件料号')}
          >
            {getFieldDecorator('materialId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.primaryMaterialNumber`).d('主件料号'),
                  }),
                },
              ],
            })(<Lov code="Z.MATERIAL_ID" queryParams={{ tenantId }} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machineCode`).d('机器编码')}
          >
            {getFieldDecorator('machineCode', {})(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machinePlatformCode`).d('机台编码')}
          >
            {getFieldDecorator('machinePlatformId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machinePlatformCode`).d('机台编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.MACHINE_PLATFORM_CODE2"
                queryParams={{ tenantId }}
                onChange={(value, record) => {
                  if (!isEmpty(value)) {
                    form.setFieldsValue({
                      siteCode: record.siteCode,
                      machineCode: record.machineCode,
                      prodLineCode: record.prodLineCode,
                    });
                  } else {
                    form.setFieldsValue({
                      siteCode: '',
                      machineCode: '',
                      prodLineCode: '',
                    });
                  }
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.programName`).d('程序名')}
          >
            {getFieldDecorator('programName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.programName`).d('程序名'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt2}.materialStationType`).d('料站类型')}
          >
            {getFieldDecorator('programType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.materialStationType`).d('料站类型'),
                  }),
                },
              ],
            })(
              <Select allowClear>
                {materialTypeMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default CreateDrawer;
