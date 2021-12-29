/*
 * @Description: 抽样类型管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 11:48:55
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 16:06:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Modal, Select, InputNumber, Input } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class CreateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
   * 生产日期变化时 批次号联动
   * @param dates
   * @param dateString
   */
  @Bind()
  handleDateChange(dates, dateString) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (!isEmpty(dateString)) {
      const date = dateString.replace(new RegExp('-', 'g'), '');
      setFieldsValue({
        lot: date,
      });
    } else {
      setFieldsValue({
        lot: '',
      });
    }
  }

  @Bind()
  handleChange(value) {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    if (value === 'SAMPLE_TYPE') {
      setFieldsValue({
        parameters: '',
        inspectionLevels: '',
      });
    }
    if (value === 'SAME_NUMBER' || value === 'SAME_PERCENTAGE') {
      setFieldsValue({
        sampleStandard: '',
        acceptanceQuantityLimit: '',
        inspectionLevels: '',
      });
    }
    if (value === 'ALL_INSPECTION') {
      setFieldsValue({
        sampleStandard: '',
        acceptanceQuantityLimit: '',
        inspectionLevels: '',
        parameters: '',
      });
    }
    if (value === 'SAMPLE_TYPE' && getFieldValue('sampleStandard') === '0') {
      setFieldsValue({
        sampleStandard: '',
      });
    }
  }

  @Bind()
  sampleStandardChange(value) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (value !== '0') {
      setFieldsValue({
        inspectionLevels: '',
      });
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { form, lovData, detail = {}, showCreateDrawer, onCancel, saveDataLoading } = this.props;
    const { sampleType = [], standardType = [], aql = [], inspectionLevels = [] } = lovData;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title="抽样类型管理"
        visible={showCreateDrawer}
        confirmLoading={saveDataLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={() => onCancel(false)}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样方式编码">
            {getFieldDecorator('sampleTypeCode', {
              initialValue: detail.sampleTypeCode,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样方式编码',
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样方式描述">
            {getFieldDecorator('sampleTypeDesc', {
              initialValue: detail.sampleTypeDesc,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样方式描述',
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样类型">
            {getFieldDecorator('sampleType', {
              initialValue: detail.sampleType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样类型',
                  }),
                },
              ],
            })(
              <Select onChange={this.handleChange} allowClear style={{ width: '100%' }}>
                {sampleType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="参数值">
            {getFieldDecorator('parameters', {
              initialValue: detail.parameters,
              rules: [
                {
                  required:
                    getFieldValue('sampleType') === 'SAME_NUMBER' ||
                    getFieldValue('sampleType') === 'SAME_PERCENTAGE',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '参数值',
                  }),
                },
              ],
            })(
              <InputNumber
                disabled={
                  !(
                    getFieldValue('sampleType') === 'SAME_NUMBER' ||
                    getFieldValue('sampleType') === 'SAME_PERCENTAGE'
                  )
                }
                formatter={value => `${value}`}
                parser={value => value.replace(/^(0+)|[^\d]+/g, '')}
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样标准">
            {getFieldDecorator('sampleStandard', {
              initialValue: detail.sampleStandard,
              rules: [
                {
                  required: getFieldValue('sampleType') === 'SAMPLE_TYPE',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样标准',
                  }),
                },
              ],
            })(
              <Select
                disabled={!(getFieldValue('sampleType') === 'SAMPLE_TYPE')}
                allowClear
                style={{ width: '100%' }}
                onChange={this.sampleStandardChange}
              >
                {standardType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="AQL值">
            {getFieldDecorator('acceptanceQuantityLimit', {
              initialValue: detail.acceptanceQuantityLimit,
              rules: [
                {
                  required: getFieldValue('sampleType') === 'SAMPLE_TYPE',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: 'AQL值',
                  }),
                },
              ],
            })(
              <Select
                allowClear
                style={{ width: '100%' }}
                disabled={!(getFieldValue('sampleType') === 'SAMPLE_TYPE')}
              >
                {aql.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="检验水平">
            {getFieldDecorator('inspectionLevels', {
              initialValue: detail.inspectionLevels,
              rules: [
                {
                  required:
                    getFieldValue('sampleType') === 'SAMPLE_TYPE' &&
                    getFieldValue('sampleStandard') === '0',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '检验水平',
                  }),
                },
              ],
            })(
              <Select
                allowClear
                style={{ width: '100%' }}
                disabled={
                  !(
                    getFieldValue('sampleType') === 'SAMPLE_TYPE' &&
                    getFieldValue('sampleStandard') === '0'
                  )
                }
              >
                {inspectionLevels.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="是否有效">
            {getFieldDecorator('enableFlag', {
              initialValue: detail.enableFlag,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '是否有效',
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                <Select.Option key="Y" value="Y">
                  是
                </Select.Option>
                <Select.Option key="N" value="N">
                  否
                </Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateDrawer;
