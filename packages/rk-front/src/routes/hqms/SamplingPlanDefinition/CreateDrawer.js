/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-30 14:06:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-14 14:13:49
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Form, Modal, Select, InputNumber } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import Lov from 'components/Lov';

@Form.create({ fieldNameProp: null })
class CreateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reAndAc: false,
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
      form: { setFieldsValue },
    } = this.props;
    if (value === '1') {
      setFieldsValue({
        re: '',
        ac: '',
        sampleSizeCodeLetter: '',
      });
      this.setState({ reAndAc: true });
    } else {
      this.setState({ reAndAc: false });
    }
    if (value === '0') {
      setFieldsValue({
        lotUpperLimit: '',
        lotLowerLimit: '',
      });
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const { form, lovData, detail, showCreateDrawer, onCancel, saveDataLoading, tenantId } = this.props;
    const { planType = [], codeType = [], aql = [], stanardType = [] } = lovData;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title="抽样方案定义"
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样计划类型">
            {getFieldDecorator('samplePlanType', {
              initialValue: detail.samplePlanType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样计划类型',
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {planType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样标准类型">
            {getFieldDecorator('sampleStandardType', {
              initialValue: detail.sampleStandardType,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样标准类型',
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }} onChange={this.handleChange}>
                {stanardType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="样本量字码">
            {getFieldDecorator('sampleSizeCodeLetter', {
              initialValue: detail.sampleSizeCodeLetter,
              rules: [
                {
                  required: getFieldValue('sampleStandardType') === '0',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '样本量字码',
                  }),
                },
              ],
            })(
              <Select disabled={this.state.reAndAc} allowClear style={{ width: '100%' }}>
                {codeType.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="批量上限">
            {getFieldDecorator('lotUpperLimit', {
              initialValue: detail.lotUpperLimit,
              rules: [
                {
                  required: getFieldValue('sampleStandardType') === '1',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '批量上限',
                  }),
                },
              ],
            })(
              <InputNumber
                disabled={getFieldValue('sampleStandardType') === '0'}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="批量下限">
            {getFieldDecorator('lotLowerLimit', {
              initialValue: detail.lotLowerLimit,
              rules: [
                {
                  required: getFieldValue('sampleStandardType') === '1',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '批量下限',
                  }),
                },
              ],
            })(
              <InputNumber
                disabled={getFieldValue('sampleStandardType') === '0'}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="AQL值">
            {getFieldDecorator('acceptanceQuantityLimit', {
              initialValue: detail.acceptanceQuantityLimit,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: 'AQL值',
                  }),
                },
              ],
            })(
              <Select allowClear style={{ width: '100%' }}>
                {aql.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.meaning}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="抽样数量">
            {getFieldDecorator('sampleSize', {
              initialValue: detail.sampleSize,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '抽样数量',
                  }),
                },
              ],
            })(
              <InputNumber
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.ac`).d('AC值')}>
            {getFieldDecorator('ac', {
              initialValue: detail.ac,
              rules: [
                {
                  required: getFieldValue('sampleStandardType') === '0',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: 'AC值',
                  }),
                },
              ],
            })(
              <InputNumber
                disabled={this.state.reAndAc}
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                min={0}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.re`).d('RE值')}>
            {getFieldDecorator('re', {
              initialValue: detail.re,
              rules: [
                {
                  required: getFieldValue('sampleStandardType') === '0',
                  message: intl.get('hzero.common.validation.notNull', {
                    name: 'RE值',
                  }),
                },
              ],
            })(
              <InputNumber
                formatter={value => `${value}`}
                parser={value => value.replace(/\D|^-/g, '')}
                style={{ width: '100%' }}
                disabled={this.state.reAndAc}
                min={0}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.enableFlag`).d('是否有效')}
          >
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.attribute1`).d('抽样方案')}>
            {getFieldDecorator('attribute1', {
              initialValue: detail.attribute1,
            })(
              <Lov
                code="QMS.SAMPLE_SCHEME"
                allowClear
                textValue={detail.attribute1Meaning}
                queryParams={{
                  tenantId,
                  schemeId: detail.schemeId,
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateDrawer;
