/**
 * 新建/编辑备料时间
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
      disableFlag: isEmpty(props.detail.preparingTimeId),
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
    const { form, tenantId, saveLoading, detail, siteMap, visible, onCancel } = this.props;
    const { getFieldDecorator } = form;
    const { disableFlag = false } = this.state;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl
          .get('hwms.basicDataMaintain.model.basicDataMaintain.tab.preparingTab')
          .d('备料时间维护')}
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
            label={intl.get(`${modelPrompt}.materialCategory`).d('物料类别')}
          >
            {getFieldDecorator('materialCategoryId', {
              initialValue: detail.materialCategoryCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.materialCategory`).d('物料类别'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.MATERIAL_CATEGORY"
                textValue={detail.materialCategoryCode}
                queryParams={{ tenantId, siteId: form.getFieldValue('siteId') }}
                disabled={disableFlag}
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
            label={intl.get(`${modelPrompt}.minimumQty`).d('最小数量')}
          >
            {getFieldDecorator('minNumQty', {
              initialValue: detail.minNumQty,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.minimumQty`).d('最小数量'),
                  }),
                },
              ],
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.maxmumQty`).d('最大数量')}
          >
            {getFieldDecorator('maxNumQty', {
              initialValue: detail.maxNumQty,
            })(<InputNumber min={1} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.workingStandardTime`).d('备料时间(min)')}
          >
            {getFieldDecorator('workStandardTime', {
              initialValue: detail.workStandardTime,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.workingStandardTime`).d('备料时间(min)'),
                  }),
                },
              ],
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
