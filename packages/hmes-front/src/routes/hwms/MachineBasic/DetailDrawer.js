/**
 * 新建/编辑备料时间
 *@date：2019/10/21
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Form, Modal, Input, Select } from 'hzero-ui';
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
      disableFlag1: true, // 是否禁用产线
      disableFlag2: true, // 是否禁用对应的B机台
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
      this.setState({ disableFlag1: true });
    } else {
      this.setState({ disableFlag1: false });
    }
  }

  /**
   * 监听机台类型变化，同步对应的B机台状态
   * @param value
   */
  @Bind()
  handleTypeChange(value) {
    const { form } = this.props;
    form.setFieldsValue({ machinePlatformCode2: undefined });
    if (isEmpty(value)) {
      this.setState({ disableFlag2: true });
    } else if (value === 'TYPE_A') {
      this.setState({ disableFlag2: false });
    }
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt2 = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const {
      form,
      showCreateDrawer,
      onCancel,
      siteMap,
      machineTypeMap,
      saveLoading,
      tenantId,
    } = this.props;
    const { getFieldDecorator } = form;
    const { disableFlag1, disableFlag2 } = this.state;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('hzero.common.button.create').d('新建')}
        visible={showCreateDrawer}
        confirmLoading={saveLoading}
        okText={intl.get('hzero.common.button.sure').d('确认')}
        cancelText={intl.get('hzero.common.button.cancel').d('取消')}
        onCancel={onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label={intl.get(`${modelPrompt}.site`).d('工厂')}>
            {getFieldDecorator('siteId', {
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
            label={intl.get(`${modelPrompt2}.productionLine`).d('产线')}
          >
            {getFieldDecorator('prodLineId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt2}.productionLine`).d('产线'),
                  }),
                },
              ],
            })(
              <Lov
                code="Z.PRODLINE"
                queryParams={{ tenantId, siteId: form.getFieldValue('siteId') }}
                disabled={disableFlag1}
              />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machineCode`).d('机器编号')}
          >
            {getFieldDecorator('machineCode', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machineCode`).d('机器编号'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machineName`).d('机器名')}
          >
            {getFieldDecorator('machineName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machineName`).d('机器名'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machinePlatformCode`).d('机台编码')}
          >
            {getFieldDecorator('machinePlatformCode1', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machinePlatformCode`).d('机台编码'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machinePlatformName`).d('机台名')}
          >
            {getFieldDecorator('machinePlatformName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machinePlatformName`).d('机台名'),
                  }),
                },
              ],
            })(<Input trim />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.machinePlatformType`).d('机台类型')}
          >
            {getFieldDecorator('machinePlatformType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.machinePlatformType`).d('机台类型'),
                  }),
                },
              ],
            })(
              <Select allowClear onChange={this.handleTypeChange}>
                {machineTypeMap.map(item => (
                  <Select.Option key={item.value}>{item.meaning}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.correspondingMachineB`).d('对应的B机台')}
          >
            {getFieldDecorator('machinePlatformCode2', {
              rules: [
                {
                  required: !disableFlag2,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.correspondingMachineB`).d('对应的B机台'),
                  }),
                },
              ],
            })(
              <Lov code="Z.CORRESPONDING_B_ID" queryParams={{ tenantId }} disabled={disableFlag2} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DetailDrawer;
