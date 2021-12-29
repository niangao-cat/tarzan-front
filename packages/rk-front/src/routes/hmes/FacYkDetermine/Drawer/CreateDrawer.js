
import React, { Component } from 'react';
import { Form, Input, InputNumber, Modal} from 'hzero-ui';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { Bind } from 'lodash-decorators';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import MultipleLov from '../../../../components/MultipleLov/index';
import ModalContainer, { registerContainer } from '../../../../components/Modal/ModalContainer';


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
        title="标准件检验标准维护"
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='物料编码'>
            {getFieldDecorator('materialId', {
              initialValue: detail.materialId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '物料编码',
                  }),
                },
              ],
            })(
              <Lov
                code="HME.SITE_MATERIAL"
                textValue={detail.materialCode}
                queryParams={{ tenantId }}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    materialName: item.materialName,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='物料描述'>
            {getFieldDecorator('materialName', {
              initialValue: detail.materialName,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label='芯片类型' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('cosType', {
              initialValue: detail.cosType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '芯片类型',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='FAC物料编码'>
            {getFieldDecorator('facMaterialId', {
              initialValue: detail.facMaterialId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: 'FAC物料编码',
                  }),
                },
              ],
            })(
              <Lov
                code="HME.SITE_MATERIAL"
                queryParams={{ tenantId }}
                textValue={detail.facMaterialCode}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    facMaterialName: item.materialName,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='FAC物料描述'>
            {getFieldDecorator('facMaterialName', {
              initialValue: detail.facMaterialName,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工位编码'>
            {getFieldDecorator('workcellIdList', {
              initialValue: detail.workcellId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '工位编码',
                  }),
                },
              ],
            })(
              detail.workcellId
                ?
                (
                  <Lov
                    code="MT.WORK_STATION"
                    textValue={detail.workcellCode}
                    queryParams={{ tenantId }}
                    onChange={(value, item) => {
                      form.setFieldsValue({
                        description: item.description,
                      });
                    }}
                  />
                )
                :
                (
                  <MultipleLov
                    code="MT.WORK_STATION"
                    textValue={detail.workcellCode}
                    queryParams={{ tenantId }}
                    onChange={(value, item) => {
                      form.setFieldsValue({
                        description: item.description,
                      });
                    }}
                  />
                )
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工位描述'>
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='标准值'>
            {getFieldDecorator('standardValue', {
              initialValue: detail.standardValue,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '标准值',
                  }),
                },
              ],
            })(
              <InputNumber />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='允差'>
            {getFieldDecorator('allowDiffer', {
              initialValue: detail.allowDiffer,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '允差',
                  }),
                },
              ],
            })(
              <InputNumber />
            )}
          </Form.Item>
          <ModalContainer ref={registerContainer} />
        </Form>
      </Modal>
    );
  }
}
export default CreateBarcodeDrawer;
