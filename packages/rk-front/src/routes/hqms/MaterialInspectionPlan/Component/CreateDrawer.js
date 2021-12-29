/*
 * @Description: 物料检验计划头创建
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-16 21:10:04
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-09-16 10:08:15
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form, Input, Select, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import notification from 'utils/notification';
// import { getSiteId, getSiteCode } from '@/utils/utils';

import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
@connect(({ deliverQuery }) => ({
  tenantId: getCurrentOrganizationId(),
  deliverQuery,
}))
export default class CreateDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (fieldsValue.materialCategoryId === undefined && fieldsValue.materialId === undefined) {
          notification.error({ message: '物料类别与物料至少输入一项!' });
        } else {
          onOk(fieldsValue);
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
      record = {},
      saveHeadLoading,
      siteList = [],
      statusLov = [],
      siteInfo={},
    } = this.props;
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    return (
      <Modal
        destroyOnClose
        width={600}
        title="物料检验计划"
        visible={visible}
        onCancel={() => onCancel(false)}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        onOk={this.handleOK}
      >
        <Spin spinning={saveHeadLoading}>
          <Form>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="组织">
              {getFieldDecorator('siteCode', {
                initialValue: record.siteName || siteInfo.siteName,
              })(
                <Select allowClear disabled>
                  {siteList.map(item => (
                    <Select.Option value={item.siteCode} key={item.siteCode}>
                      {item.siteName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} style={{ display: 'none' }}>
              {getFieldDecorator('siteId', {
                initialValue: siteInfo.siteId,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料类别">
              {getFieldDecorator('materialCategoryId', {
                initialValue: record.materialCategoryId,
              })(
                <Lov
                  textValue={record.categoryDesc}
                  queryParams={{ tenantId }}
                  code="QMS.MATERIAL_TYPE"
                  textField="description"
                  disabled={!!(getFieldValue('materialId') || record.objectVersionNumber)}
                  onChange={() => {
                    setFieldsValue({
                      materialId: null,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料编码">
              {getFieldDecorator('materialId', {
                initialValue: record.materialId,
              })(
                <Lov
                  code="QMS.MATERIAL"
                  queryParams={{ tenantId }}
                  textValue={record.materialCode}
                  onChange={(value, item) => {
                    setFieldsValue({
                      materialName: item.materialName,
                      materialCategoryId: null,
                      materialVersion: null,
                    });
                  }}
                  disabled={getFieldValue('materialCategoryId') || record.objectVersionNumber}
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料描述">
              {getFieldDecorator('materialName', {
                initialValue: record.materialName,
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('materialId', {
                initialValue: record.materialId,
              })}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="物料版本">
              {getFieldDecorator('materialVersion', {
                initialValue: record.materialVersion,
              })(
                <Lov
                  code="HME.MATERIAL_VERSION"
                  queryParams={{
                    tenantId,
                    siteId: siteInfo.siteId,
                    materialId: getFieldValue('materialId'),
                  }}
                  disabled={!getFieldValue('materialId')}
                  textValue={record.materialVersion}
                />
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="检验类型">
              {getFieldDecorator('inspectionType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.inspectionType`).d('检验类型'),
                    }),
                  },
                ],
                initialValue: record.inspectionType,
              })(
                <Select allowClear>
                  {testTypeLov.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="状态">
              {getFieldDecorator('status', {
                initialValue: record.status || 'NEW',
              })(
                <Select disabled>
                  {statusLov.map(item => (
                    <Select.Option key={item.value}>{item.meaning}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="检验文件号">
              {getFieldDecorator('inspectionFile', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.inspectionFile`).d('检验文件号'),
                    }),
                  },
                ],
                initialValue: record.inspectionFile,
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.fileVersion`).d('文件版本号')}
            >
              {getFieldDecorator('fileVersion', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.fileVersion`).d('文件版本号'),
                    }),
                  },
                ],
                initialValue: record.fileVersion,
              })(<Input />)}
            </Form.Item>
            <Form.Item
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('是否有效')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: record.enableFlag || 'Y',
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.createQty`).d('是否有效'),
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  <Select.Option key="Y">是</Select.Option>
                  <Select.Option key="N">否</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
