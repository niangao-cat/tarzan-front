/**
 * 新建/编辑组件配送策略
 *@date：2019/10/21
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Modal, Switch, Select, InputNumber } from 'hzero-ui';
import Lov from 'components/Lov';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class DetailDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableFlag: isEmpty(props.detail.strategyId),
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
   * 监听工厂变化,查询物料类别列表
   * @param value
   */
  @Bind()
  handleSiteChange(value) {
    const { form } = this.props;
    form.setFieldsValue({ materialCategoryId: undefined });
    if (isEmpty(value)) {
      this.setState({ disableFlag: true });
    } else {
      this.setState({ disableFlag: false });
    }
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
      editFlag,
      saveLoading,
      detail,
      siteMap,
      deliveryMethodMap,
      visible,
      onCancel,
    } = this.props;
    const { disableFlag } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl
          .get('hwms.basicDataMaintain.model.basicDataMaintain.tab.strategyTab')
          .d('配送策略维护')}
        visible={visible}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.site`).d('工厂')}>
            {getFieldDecorator('siteId', {
              initialValue: detail.siteId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.site`).d('工厂'),
                  }),
                },
              ],
            })(
              <Select allowClear disabled={editFlag} onChange={this.handleSiteChange}>
                {siteMap.map(item => (
                  <Select.Option key={item.siteId}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialCategory`).d('物料类型')}
          >
            {getFieldDecorator('materialCategoryId', {
              initialValue: detail.materialCategoryCode,
            })(
              <Lov
                code="Z.MATERIAL_CATEGORY"
                textValue={detail.materialCategoryCode}
                queryParams={{ tenantId, siteId: form.getFieldValue('siteId') }}
                disabled={editFlag || disableFlag}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    materialCategoryCode: item.materialCategoryCode,
                  });
                }}
              />
            )}
            {getFieldDecorator('materialCategoryCode', {
              initialValue: detail.materialCategoryCode,
            })}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.materialCode`).d('物料')}
          >
            {getFieldDecorator('materialId', {
              initialValue: detail.materialCode,
            })(
              <Lov
                code="Z.MATERIALCODE"
                queryParams={{ tenantId }}
                disabled={editFlag}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    materialCode: item.materialCode,
                  });
                }}
              />
            )}
            {getFieldDecorator('materialCode', {
              initialValue: detail.materialCode,
            })}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.deliveryMethod`).d('配送方式')}
          >
            {getFieldDecorator('deliveryMethod', {
              initialValue: detail.deliveryMethod,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.deliveryMethod`).d('配送方式'),
                  }),
                },
              ],
            })(
              <Select allowClear>
                {deliveryMethodMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.deliveryQtyPerTime`).d('单次配送量')}
          >
            {getFieldDecorator('deliveryQtyPt', {
              initialValue: detail.deliveryQtyPt,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.trayLoadingFlag`).d('整托发料')}
          >
            {getFieldDecorator('trayLoadingFlag', {
              initialValue: isEmpty(detail.trayLoadingFlag) ? 'N' : detail.trayLoadingFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
          >
            {getFieldDecorator('enableFlag', {
              initialValue: isEmpty(detail.enableFlag) ? 'Y' : detail.enableFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.consolidatedFlag`).d('合并发料')}
          >
            {getFieldDecorator('consolidatedFlag', {
              initialValue: isEmpty(detail.consolidatedFlag) ? 'N' : detail.consolidatedFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DetailDrawer;
