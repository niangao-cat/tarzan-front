/*
 * @Description: 数据采集
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-23 14:36:30
 * @LastEditTime: 2020-07-27 12:04:50
 */

import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import Lov from 'components/Lov';
import { getCurrentOrganizationId } from 'utils/utils';
import {
  DRAWER_FORM_ITEM_LAYOUT,
} from '@/utils/constants';

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
const tenantId = getCurrentOrganizationId();
@connect(({ loading }) => ({
  checkLoading: loading.effects['dataItem/copyTag'],
}))
@formatterCollections({ code: 'tarzan.acquisition.dataItem' })
@Form.create({ fieldNameProp: null })
export default class DataCollectionDrawer extends React.PureComponent {

  @Bind()
  handleOK() {
    const { form, onOk } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        onOk(fieldsValue);
      }
    });
  }

  render() {
    const { form, editFlag, dataCollection, visible, onCancel, saveDataCollectionLoading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={400}
        title='数据采集'
        visible={visible}
        onCancel={onCancel}
        confirmLoading={saveDataCollectionLoading}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.equipmentCategory`).d('设备类别')}
          >
            {getFieldDecorator('equipmentCategory', {
              initialValue: dataCollection.equipmentCategory,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.equipmentCategory`).d('设备类别'),
                  }),
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                }}
                disabled={editFlag}
                allowClear
                code="HME.EQUIPMENT_CATEGORY"
                textValue={dataCollection.equipmentCategory}
                onChange={() => {
                  form.resetFields();
                }}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.valueField`).d('取值字段')}
          >
            {getFieldDecorator('valueField', {
              initialValue: dataCollection.valueField,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.valueField`).d('取值字段'),
                  }),
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                  equipmentCategory: getFieldValue('equipmentCategory'),
                }}
                disabled={editFlag || !getFieldValue('equipmentCategory')}
                allowClear
                code="HME.DATA_ACQUISITION_FIELD"
                textValue={dataCollection.valueFieldMeaning}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.limitCond1`).d('限制条件1')}
          >
            {getFieldDecorator('limitCond1', {
              initialValue: dataCollection.limitCond1,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if ((getFieldValue('limitCond2') === value)&&value||(getFieldValue('valueField') === value)&&value) {
                      callback(
                        '当前限制值存在相同值'
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                  equipmentCategory: getFieldValue('equipmentCategory'),
                }}
                disabled={editFlag || !getFieldValue('equipmentCategory')}
                allowClear
                code="HME.DATA_ACQUISITION_FIELD"
                textValue={dataCollection.limitCond1Meaning}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.cond1Value`).d('条件1限制值')}
          >
            {getFieldDecorator('cond1Value', {
              initialValue: dataCollection.cond1Value,
              rules: [
                {
                  required: getFieldValue('limitCond1'),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.valueField`).d('条件1限制值'),
                  }),
                },
              ],
            })(
              <Input
                disabled={editFlag || !getFieldValue('equipmentCategory')}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.limitCond2`).d('限制条件2')}
          >
            {getFieldDecorator('limitCond2', {
              initialValue: dataCollection.limitCond2,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    if ((getFieldValue('limitCond1') === value)&&value||(getFieldValue('valueField') === value)&&value) {
                      callback(
                        '当前限制值存在相同值'
                      );
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                  equipmentCategory: getFieldValue('equipmentCategory'),
                }}
                disabled={editFlag || !getFieldValue('equipmentCategory')}
                allowClear
                code="HME.DATA_ACQUISITION_FIELD"
                textValue={dataCollection.limitCond2Meaning}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.cond2Value`).d('条件2限制值')}
          >
            {getFieldDecorator('cond2Value', {
              initialValue: dataCollection.cond2Value,
              rules: [
                {
                  required: getFieldValue('limitCond2'),
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.valueField`).d('条件1限制值'),
                  }),
                },
              ],
            })(
              <Input
                disabled={editFlag || !getFieldValue('equipmentCategory')}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
