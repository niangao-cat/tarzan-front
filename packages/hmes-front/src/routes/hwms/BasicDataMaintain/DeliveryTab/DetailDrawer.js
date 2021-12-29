/**
 * 新建/编辑送料时间
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
      disableFlag: isEmpty(props.detail.deliveryTimeId),
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
   * 监听工厂变化,查询产线列表
   * @param value
   */
  @Bind()
  handleSiteChange(value) {
    const { form } = this.props;
    form.setFieldsValue({ prodLineId: undefined });
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
      saveLoading,
      detail,
      siteMap,
      warehouseMap,
      visible,
      onCancel,
    } = this.props;
    const { getFieldDecorator } = form;
    const { disableFlag = false } = this.state;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl
          .get('hwms.basicDataMaintain.model.basicDataMaintain.tab.deliveryTab')
          .d('送料时间维护')}
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
              <Select allowClear onChange={this.handleSiteChange}>
                {siteMap.map(item => (
                  <Select.Option key={item.siteId}>{item.description}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.warehouseCategory`).d('仓库类型')}
          >
            {getFieldDecorator('warehouseCategoryCode', {
              initialValue: detail.warehouseCategoryCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.warehouseCategory`).d('仓库类型'),
                  }),
                },
              ],
            })(
              <Select allowClear>
                {warehouseMap.map(item => (
                  <Select.Option key={item.value}>{item.value}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.productionLine`).d('送达产线')}
          >
            {getFieldDecorator('prodLineId', {
              initialValue: detail.prodLineCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.productionLine`).d('送达产线'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.PRODLINE"
                textValue={detail.prodLineCode}
                queryParams={{ tenantId, siteId: form.getFieldValue('siteId') }}
                disabled={disableFlag}
                onChange={(value, item) => {
                  form.setFieldsValue({
                    prodLineCode: item.prodLineCode,
                  });
                }}
              />
            )}
            {getFieldDecorator('prodLineCode', {
              initialValue: detail.prodLineCode,
            })}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.personStandardTime`).d('人工送料时间(min)')}
          >
            {getFieldDecorator('personStandardTime', {
              initialValue: detail.personStandardTime,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.AGVStandardTime`).d('AGV送料时间(min)')}
          >
            {getFieldDecorator('agvStandardTime', {
              initialValue: detail.agvStandardTime,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
          >
            {getFieldDecorator('enableFlag', {
              initialValue: isEmpty(detail.enableFlag) ? 'Y' : detail.enableFlag,
            })(<Switch checkedValue="Y" unCheckedValue="N" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DetailDrawer;
