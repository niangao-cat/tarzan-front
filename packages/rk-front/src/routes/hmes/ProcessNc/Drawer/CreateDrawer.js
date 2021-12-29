
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
      statusList,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={450}
        title="工序不良判定标准维护"
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='物料'>
            {getFieldDecorator('materialId', {
              initialValue: detail.materialId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                  name: '物料',
                  }),
                },
              ],
            })(
              <Lov
                code="MT.MATERIAL"
                textValue={detail.materialCode}
                queryParams={{ tenantId }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='产品代码'>
            {getFieldDecorator('productCode', {
              initialValue: detail.productCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                  name: '产品代码',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='COS型号'>
            {getFieldDecorator('cosModel', {
              initialValue: detail.cosModel,
              // rules: [
              //   {
              //     required: true,
              //     message: intl.get('hzero.common.validation.notNull', {
              //     name: 'COS型号',
              //     }),
              //   },
              // ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="芯片组合">
            {getFieldDecorator('chipCombination', {
              initialValue: detail.chipCombination,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="工艺编码">
            {getFieldDecorator('operationId', {
              initialValue: detail.operationId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                  name: '工艺编码',
                  }),
                },
              ],
            })(
              <Lov
                code="MT.OPERATION"
                queryParams={{tenantId}}
                textValue={detail.operationName}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    description: item.description,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工艺描述'>
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工序编码'>
            {getFieldDecorator('workcellId', {
              initialValue: detail.workcellId,
            })(
              <Lov
                code="HME.WORK_PROCESS"
                textValue={detail.workcellCode}
                queryParams={{ tenantId }}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    workcellName: item.workcellName,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label='工序描述'>
            {getFieldDecorator('workcellName', {
              initialValue: detail.workcellName,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="状态">
            {getFieldDecorator('status', {
              initialValue: detail.status,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                  name: '状态',
                  }),
                },
              ],
            })(
              <Select style={{ width: '100%' }} allowClear>
                {statusList.map(item => {
                  return (
                    <Select.Option value={item.statusCode} key={item.statusCode}>
                      {item.description}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateBarcodeDrawer;
