/**
 * 物流器具条码创建
 *@date：2019/9/18
 *@author：junhui.liu
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Input, Modal, Select, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import { isEmpty } from 'lodash';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class NewCreateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerCodeFlag: isEmpty(props.detail.ownerType),
      ownerCodeParam: props.detail.ownerType,
    };
  }

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
   * 所有者类型发生改变
   * @param value
   */
  @Bind()
  changeOwnerType(value) {
    this.props.form.setFieldsValue({ ownerId: undefined });
    if (isEmpty(value)) {
      this.setState({ ownerCodeFlag: true });
    } else {
      this.setState({ ownerCodeFlag: false, ownerCodeParam: value });
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.applianceCreation.model.applianceCreation';
    const { ownerCodeFlag, ownerCodeParam } = this.state;
    const {
      form,
      tenantId,
      saveLoading,
      detail,
      ownerTypeMap,
      onCancel,
      showNewCreateDrawer,
      defaultSite = {},
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('hwms.applianceCreation.view.message.createContainer').d('物流器具创建')}
        visible={showNewCreateDrawer}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.containerType`).d('物流器具类型')}
          >
            {getFieldDecorator('containerTypeId', {
              initialValue: detail.containerTypeId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.containerType`).d('物流器具类型'),
                  }),
                },
              ],
            })(<Lov queryParams={{ tenantId }} code="Z.CONTAINER_TYPE" />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.containerName`).d('物流器具名称')}
          >
            {getFieldDecorator('containerName', {
              initialValue: detail.containerName,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.containerDesc`).d('物流器具描述')}
          >
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.plant`).d('工厂')}
          >
            {getFieldDecorator('siteId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.plant`).d('工厂'),
                  }),
                },
              ],
              initialValue: defaultSite.siteId,
            })(<Lov code="MT.MOD.SITE_MT_LOT" queryParams={{ tenantId }} textValue={defaultSite.siteName} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.locator`).d('货位')}
          >
            {getFieldDecorator('locatorId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.locator`).d('货位'),
                  }),
                },
              ],
            })(<Lov code="MT.MTL_LOCATOR" queryParams={{ tenantId }} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.ownerType`).d('所有者类型')}
          >
            {getFieldDecorator('ownerType', {
              initialValue: detail.ownerType,
            })(
              <Select onChange={this.changeOwnerType} allowClear>
                {ownerTypeMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.ownerCode`).d('所有者编码')}
          >
            {getFieldDecorator('ownerId', {
              rules: [
                {
                  required: !ownerCodeFlag,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.ownerCode`).d('所有者编码'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.CONTAINER.OWNER.CODE"
                queryParams={{ tenantId, ownerType: ownerCodeParam }}
                disabled={ownerCodeFlag}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.createReason`).d('创建原因')}
          >
            {getFieldDecorator('createReason', {})(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.batchNum`).d('数量')}
          >
            {getFieldDecorator('batchNum', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.batchNum`).d('数量'),
                  }),
                },
              ],
              initialValue: 1,
            })(
              <InputNumber
                trim
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{width: '100%'}}
                min={1}
              />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default NewCreateDrawer;
