/**
 * routeLinkDetails 类型设置: 嵌套工艺路线
 * @date: 2019-8-20
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import formatterCollections from 'utils/intl/formatterCollections';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import Lov from 'components/Lov';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.process.routes.model.routes';

@connect(({ routes }) => ({
  routes,
}))
@formatterCollections({ code: 'tarzan.process.routes' })
@Form.create()
export default class RouteLinkDetailsDrawer extends React.PureComponent {
  @Bind()
  handleOK = () => {
    const { form, routeLinkHandle, dataSourceId } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        routeLinkHandle(values, dataSourceId, 'mtRouterLinkDTO', 'routeLinkDetailsVisible');
      }
    });
  };

  @Bind()
  onCancel = () => {
    this.props.onCancel('routeLinkDetailsVisible');
  };

  @Bind()
  changeCode = (value, records) => {
    this.props.form.setFieldsValue({
      routerId: value,
      routerName: records.routerName,
      routerType: records.routerType,
      revision: records.revision,
      currentFlag: records.currentFlag,
      description: records.description,
      routerStatus: records.routerStatus,
      dateFrom: records.dateFrom,
      dateTo: records.dateTo,
      bomId: records.bomId,
      bomName: records.bomName,
    });
  };

  render() {
    const { form, visible, canEdit, dataSource = {} } = this.props;
    const {
      routerId = '',
      routerName = '',
      routerType = '',
      revision = '',
      currentFlag = '',
      description = '',
      routerStatus = '',
      dateFrom = '',
      dateTo = '',
      bomId = '',
      bomName = '',
    } = dataSource;
    const { getFieldDecorator } = form;
    const tenantId = getCurrentOrganizationId();
    return (
      <Modal
        destroyOnClose
        width={360}
        title={intl.get('tarzan.process.routes.title.routerLink').d('类型设置: 嵌套工艺路线')}
        //  groupType
        //  operationTyle
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Form>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.routerId`).d('工艺路线')}
          >
            {getFieldDecorator('routerId', {
              initialValue: routerId,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: intl.get(`${modelPrompt}.routerId`).d('工艺路线'),
                  }),
                },
              ],
            })(
              <Lov
                disabled={!canEdit}
                code="MT.ROUTER"
                textValue={routerName}
                onChange={this.changeCode}
                queryParams={{ tenantId }}
              />
            )}
          </Form.Item>
          <Form.Item style={{ display: 'none' }}>
            {getFieldDecorator('routerName', { initialValue: routerName })(<Input />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.routerType`).d('类型')}
          >
            {getFieldDecorator('routerType', {
              initialValue: routerType,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.revision`).d('版本')}
          >
            {getFieldDecorator('revision', {
              initialValue: revision,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.currentFlag`).d('当前版本')}
          >
            {getFieldDecorator('currentFlag', {
              initialValue: currentFlag === 'Y',
            })(<Switch disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.description`).d('描述')}
          >
            {getFieldDecorator('description', {
              initialValue: description,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.routerStatus`).d('状态')}
          >
            {getFieldDecorator('routerStatus', {
              initialValue: routerStatus,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.dateFrom`).d('生效时间')}
          >
            {getFieldDecorator('dateFrom', {
              initialValue: dateFrom,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.dateTo`).d('失效时间')}
          >
            {getFieldDecorator('dateTo', {
              initialValue: dateTo,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item {...DRAWER_FORM_ITEM_LAYOUT} style={{ display: 'none' }}>
            {getFieldDecorator('bomId', {
              initialValue: bomId,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item
            {...DRAWER_FORM_ITEM_LAYOUT}
            label={intl.get(`${modelPrompt}.bomName`).d('装配清单')}
          >
            {getFieldDecorator('bomName', {
              initialValue: bomName,
            })(<Input disabled />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
