/*
 * @Description: inspectionPlan
 * @version: 0.1.0
 * @Author: wenjie.yang@hand-china.com
 * @Date: 2020-04-16 16:27:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 10:47:07
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, Select, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import notification from 'utils/notification';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
export default class CreateDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  @Bind()
  handleOK() {
    const { form, onConfirm } = this.props;
    form.validateFields((err, val) => {
      if (!err) {
        if (`${val.siteId}${val.materialId}` === `${val.siteIdTo}${val.materialIdTo}`) {
          return notification.error({ message: '来源组织+来源物料与目标组织+目标物料不可相同!' });
        } else {
          onConfirm(val);
        }
      }
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      onCancel,
      form,
      testTypeLov,
      tenantId,
      loading,
      selectedHead,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={600}
        title="巡检检验计划"
        visible={visible}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        confirmLoading={loading}
      >
        <Spin spinning={loading || false}>
          <Form>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="来源组织">
              {getFieldDecorator('siteId', {
                initialValue: selectedHead[0].siteId,
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.SITE"
                  textValue={selectedHead[0].siteCode}
                  disabled
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="来源物料">
              {getFieldDecorator('materialId', {
                initialValue: selectedHead[0].materialId,
              })(
                <Lov
                  disabled
                  code="QMS.MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={selectedHead[0].materialCode}
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="检验类型">
              {getFieldDecorator('inspectionType', {
                initialValue: selectedHead[0].inspectionType,
              })(
                <Select allowClear disabled>
                  {testTypeLov.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="目标组织">
              {getFieldDecorator('siteIdTo', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标组织',
                    }),
                  },
                ],
              })(
                <Lov
                  queryParams={{ tenantId }}
                  code="MT.SITE"
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="目标物料">
              {getFieldDecorator('materialIdTo', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '目标物料',
                    }),
                  },
                ],
              })(
                <Lov code="QMS.MATERIAL" queryParams={{ tenantId }} />
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
