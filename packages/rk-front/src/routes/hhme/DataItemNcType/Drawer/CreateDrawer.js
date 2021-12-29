
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
    const {
      form,
      detail,
      onCancel,
      visible,
      tenantId,
      saveHeadDataLoading,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={450}
        title="数据项计算公式维护"
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工艺编码'>
            {getFieldDecorator('operationId', {
              initialValue: detail.operationId,
            })(
              <Lov
                code="MT.OPERATION"
                // textValue={operationName}
                queryParams={{ tenantId }}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    operationName: item.description,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工艺描述'>
            {getFieldDecorator('operationName', {
              // initialValue: detail.operationName,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="项目组">
            {getFieldDecorator('tagGroupId', {
              rules: [
                {
                  required: !getFieldValue('equipmentId'),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '项目组',
                  }),
                },
              ],
              initialValue: detail.tagGroupId,
            })(
              <Lov
                code="HME.TAG_GROUP"
                queryParams={{
                  tenantId,
                }}
                allowClear
                onChange={(value, item) => {
                  form.setFieldsValue({
                    tagGroupCode: item.tagGroupCode,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='项目组编码'>
            {getFieldDecorator('tagGroupCode', {
              // initialValue: detail.operationName,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label='项目' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('tagId', {
              initialValue: detail.businessId,
            })(
              <Lov
                code="MT.TAG_LINE"
                queryParams={{ tenantId }}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    tagDescription: item.tagDescription,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='项目描述'>
            {getFieldDecorator('tagDescription', {
              // initialValue: detail.tagDescriptions,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label='公式类型' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('gslx', {
              // initialValue: detail.operationId,
            })(
              <Select
                style={{ width: '100%' }}
                allowClear
              >
                {[].map(item => {
                  return (
                    <Select.Option value={item.typeCode} key={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='公式' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('gs', {
              // initialValue: detail.operationDescription,
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateBarcodeDrawer;
