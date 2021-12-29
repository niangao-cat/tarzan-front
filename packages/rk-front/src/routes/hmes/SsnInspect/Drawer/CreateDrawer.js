
import React, { Component } from 'react';
import { Form, Input, Modal, Select } from 'hzero-ui';
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
      workWayMap,
    } = this.props;
    const { getFieldDecorator } = form;
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
          <Form.Item label='标准件编码' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('standardSnCode', {
              initialValue: detail.standardSnCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '标准件编码',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
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
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label='工作方式' {...DRAWER_FORM_ITEM_LAYOUT}>
            {getFieldDecorator('workWay', {
              initialValue: detail.workWay,
            })(
              <Select allowClear>
                {workWayMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工位编码'>
            {getFieldDecorator('workcellIdList', {
              initialValue: detail.workcellId,
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
                        workcellName: item.workcellName,
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
                        workcellName: item.workcellName,
                      });
                    }}
                  />
                )
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工位描述'>
            {getFieldDecorator('workcellName', {
              initialValue: detail.workcellName,
            })(
              <Input disabled />
            )}
          </Form.Item>
        </Form>
        <Form.Item
          {...DRAWER_FORM_ITEM_LAYOUT}
          label='有效性'
        >
          {getFieldDecorator('enableFlag', {
            initialValue: detail.enableFlag || 'Y',
          })(
            <Select style={{ width: '100%'}} allowClear>
              <Select.Option key='Y' value='Y'>
                是
              </Select.Option>
              <Select.Option key='N' value='N'>
                否
              </Select.Option>
            </Select>
            )}
        </Form.Item>
        <ModalContainer ref={registerContainer} />
      </Modal>
    );
  }
}
export default CreateBarcodeDrawer;
