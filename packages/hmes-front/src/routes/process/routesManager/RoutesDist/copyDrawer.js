/**
 * UserGroupManagement 复制抽屉
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.process.routes.model.routes';
const { Option } = Select;

@connect(({ routes, loading }) => ({
  routes,
  copyLoading: loading.effects['routes/copyRoutesList'],
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create({ fieldNameProp: null })
export default class CopyDrawer extends React.PureComponent {
  @Bind
  handleOK = () => {
    const { form, copySuccess, routerId } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // eslint-disable-next-line no-param-reassign
        values.sourceRouterId = routerId;
        copySuccess(values);
      }
    });
  };

  render() {
    const {
      form,
      visible,
      onCancel,
      copyLoading,
      routes: { typeList = [], routesItem = {} },
    } = this.props;
    const { routerName } = routesItem;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.process.routes.title.copy').d('工艺路线复制')}
        visible={visible}
        onCancel={onCancel}
        confirmLoading={copyLoading}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.sourceRouter`).d('来源工艺路线')}
          >
            {getFieldDecorator('sourceRouterId', {
              initialValue: routerName,
              // rules: [
              //   {
              //     required: true,
              //     message: intl.get('hzero.common.validation.notNull', {
              //       name: intl.get(`${modelPrompt}.sourceRouter`).d('来源工艺路线'),
              //     }),
              //   },
              // ],
            })(
              // <Lov
              //   code="MT.ROUTER"
              //   // onChange={(value, records) => this.changeCode(value, records, index)}
              //   queryParams={{ tenantId }}
              // />
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.targetSite`).d('目标站点')}
          >
            {getFieldDecorator('targetSiteId', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.targetSite`).d('目标站点'),
                  }),
                },
              ],
            })(<Lov code="MT.SITE" queryParams={{ tenantId }} />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.targetRouterName`).d('目标编码')}
          >
            {getFieldDecorator('targetRouterName', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.targetRouterName`).d('目标编码'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.targetRouterType`).d('目标类型')}
          >
            {getFieldDecorator('targetRouterType', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.targetRouterType`).d('目标类型'),
                  }),
                },
              ],
            })(
              <Select>
                {typeList.map(ele => (
                  <Option value={ele.typeCode}>{ele.description}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.targetRevision`).d('目标版本')}
          >
            {getFieldDecorator('targetRevision', {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.targetRevision`).d('目标版本'),
                  }),
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
