/**
 * 创建条码
 *@date：2019/9/12
*@author：jxy <xiaoyan.jin@hand-china.com>
*@version：0.0.1
*@copyright Copyright (c) 2019,Hand
*/
import React from 'react';
import { Form, Input, Modal, Select } from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

const Drawer = (props) => {
  const handleOK = () => {
    const { form, onOk, record } = props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk({...record, ...fieldsValue});
      }
    });
  };

  const handleChangeMaterialId = (val, record) => {
    const { setFieldsValue } = props.form;
    setFieldsValue({ materialName: record.materialName });
  };

  const handleChangeNcId = (val, record) => {
    const { setFieldsValue } = props.form;
    setFieldsValue({ description: record.description });
  };

  const handleChangeTransitionMaterialId = (val, record) => {
    const { setFieldsValue } = props.form;
    setFieldsValue({ transitionMaterialName: record.materialName });
  };

  const {
    form,
    tenantId,
    saveLoading,
    visible,
    onCancel,
    record,
  } = props;
  const { getFieldDecorator } = form;

  return (
    <Modal
      destroyOnClose
      width={500}
      title='新增'
      visible={visible}
      confirmLoading={saveLoading}
      okText={intl.get('hzero.common.button.sure').d('确认')}
      cancelText={intl.get('hzero.common.button.cancel').d('取消')}
      onCancel={onCancel}
      onOk={handleOK}
      wrapClassName="ant-modal-sidebar-right"
      transitionName="move-right"
    >
      <Form>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='产品编码'>
          {getFieldDecorator('materialId', {
            initialValue: record.materialId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: '产品编码',
                }),
              },
            ],
            })(
              <Lov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId }}
                textValue={record.materialCode}
                onChange={handleChangeMaterialId}
              />
            )}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='产品描述'>
          {getFieldDecorator('materialName', {
            initialValue: record.materialName,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="不良代码">
          {getFieldDecorator('ncCodeId', {
            initialValue: record.ncCodeId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: '不良代码',
                }),
              },
            ],
            })(
              <Lov
                code="MT.NC_CODE"
                queryParams={{ tenantId }}
                textValue={record.ncCode}
                onChange={handleChangeNcId}
              />
            )}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='不良代码描述'>
          {getFieldDecorator('description', {
            initialValue: record.description,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="降级物料编码">
          {getFieldDecorator('transitionMaterialId', {
            initialValue: record.transitionMaterialId,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: '降级物料编码',
                }),
              },
            ],
          })(
            <Lov
              code="HME.SITE_MATERIAL"
              queryParams={{ tenantId }}
              textValue={record.transitionMaterialCode}
              onChange={handleChangeTransitionMaterialId}
            />
          )}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='降级物料编码描述'>
          {getFieldDecorator('transitionMaterialName', {
            initialValue: record.transitionMaterialName,
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='有效性'>
          {getFieldDecorator('enableFlag', {
            initialValue: record.enableFlag,
            rules: [
              {
                required: true,
                message: intl.get('hzero.common.validation.notNull', {
                  name: '产品编码',
                }),
              },
            ],
            })(
              <Select allowClear>
                <Select.Option key="Y" value="Y">是</Select.Option>
                <Select.Option key="N" value="N">否</Select.Option>
              </Select>
            )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create({ fieldNameProp: null })(Drawer);
