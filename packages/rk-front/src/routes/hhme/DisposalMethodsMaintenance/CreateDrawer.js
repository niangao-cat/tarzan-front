/**
 * @description 处置方法维护
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 10:20
 * @version 0.0.1
 */
import React, { Component } from 'react';
import { Form, Modal, Select, Input } from 'hzero-ui';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';

@Form.create({ fieldNameProp: null })
class CreateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { form, detail = {}, showCreateDrawer, onCancel, saveDataLoading, functionType, tenantId, defaultSite } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        destroyOnClose
        width={360}
        title="处置方法维护"
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
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="站点">
            {getFieldDecorator('siteId', {
              initialValue: detail.siteId||defaultSite.siteId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '站点',
                  }),
                },
              ],
            })(
              <Lov
                queryParams={{
                  tenantId,
                }}
                code="MT.SITE"
                textValue={detail.siteCode||defaultSite.siteCode}
              />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="处置方法编码">
            {getFieldDecorator('dispositionFunction', {
              initialValue: detail.dispositionFunction,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '处置方法编码',
                  }),
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="处置方法类型">
            {getFieldDecorator('functionType', {
              initialValue: detail.functionType || 'REWORK',
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '处置方法类型',
                  }),
                },
              ],
            })(
              <Select style={{ width: '100%' }}>
                {functionType.map(item => (
                  <Select.Option key={item.typeCode} value={item.typeCode}>
                    {item.description}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="处置方法描述">
            {getFieldDecorator('description', {
              initialValue: detail.description,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} label="工艺路线">
            {getFieldDecorator('routerId', {
              initialValue: detail.routerId,
            })(
              <Lov
                code="MT.ROUTER"
                queryParams={{ tenantId }}
                textValue={detail.routerName}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default CreateDrawer;
