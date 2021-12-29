/**
 * UserRightsDrawer 用户权限编辑抽屉
 * @date: 2019-7-31
 * @author: hdy <deying.huang@hand-china.com>
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Input, Modal, Spin, Select, Switch } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { DRAWER_FORM_ITEM_LAYOUT } from '@/utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import { isUndefined } from 'lodash';
import notification from 'utils/notification';

const modelPrompt = 'tarzan.mes.userRights.model.userRights';
const FormItem = Form.Item;
const tenantId = getCurrentOrganizationId();

@connect(({ userRights, loading }) => ({
  userRights,
  fetchLoading: loading.effects['userRights/fetchUserRightsList'],
}))
@Form.create({ fieldNameProp: null })
export default class UserRightsDrawer extends React.PureComponent {
  state = {
    userId: undefined,
    organizationId: undefined,
    newOrganizationType: undefined,
  };

  @Bind()
  handleOK() {
    const { form, dispatch, initData, onOk = e => e } = this.props;
    const { userId, organizationId } = this.state;
    form.validateFields((err, fieldsValue) => {
      const that = this;
      if (!err) {
        const enableFlag = fieldsValue.enableFlag ? 'Y' : 'N';
        const defaultOrganizationFlag = fieldsValue.defaultOrganizationFlag ? 'Y' : 'N';
        dispatch({
          type: 'userRights/saveUserRights',
          payload: {
            ...initData,
            ...fieldsValue,
            enableFlag,
            defaultOrganizationFlag,
            userId: isUndefined(userId) ? initData.userId : userId,
            organizationId: isUndefined(organizationId) ? initData.organizationId : organizationId,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            that.setState({
              userRightsDrawerVisible: false,
              initUserRightsData: {},
              userId: undefined,
              organizationId: undefined,
              newOrganizationType: undefined,
            });
            onOk();
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  @Bind
  handleCancel() {
    const { onCancel } = this.props;
    onCancel();
    this.setState({
      userId: undefined,
      organizationId: undefined,
      newOrganizationType: undefined,
    });
  }

  // 用户账号LOV
  @Bind()
  onUserCountChange(value, record) {
    this.setState({
      userId: record.id,
    });
    this.props.form.setFieldsValue({ userDesc: record.realName });
  }

  // 组织对象LOV
  @Bind()
  onOrganizationCodeChange(value, record) {
    this.setState({
      organizationId: record.organizationId,
    });
    this.props.form.setFieldsValue({ organizationDesc: record.organizationDesc });
  }

  // 组织层级下拉框选中事件
  @Bind()
  onOrganizationTypeChange(value) {
    this.setState({
      newOrganizationType: value,
    });
    this.props.form.setFieldsValue({ organizationCode: null, organizationDesc: null });
  }

  render() {
    const { form, initData, visible, organizationTypeList } = this.props;
    const {
      userName,
      userDesc,
      organizationType,
      organizationCode,
      enableFlag,
      defaultOrganizationFlag,
      organizationDesc,
    } = initData;
    const { getFieldDecorator } = form;
    const { newOrganizationType } = this.state;
    return (
      <Modal
        destroyOnClose
        width={360}
        title={
          initData.cid
            ? intl.get('tarzan.mes.userRights.title.edit').d('编辑用户权限')
            : intl.get('tarzan.mes.userRights.title.create').d('新建用户权限')
        }
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOK}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Spin spinning={false}>
          <Form>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.userName`).d('员工账号')}
            >
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.userName`).d('员工账号'),
                    }),
                  },
                ],
                initialValue: userName,
              })(
                <Lov code="HIAM.USER.ORG" textValue={userName} onChange={this.onUserCountChange} />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.userDesc`).d('员工姓名')}
            >
              {getFieldDecorator('userDesc', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.userDesc`).d('员工姓名'),
                    }),
                  },
                ],
                initialValue: userDesc,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationType`).d('组织层级')}
            >
              {getFieldDecorator('organizationType', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.organizationType`).d('组织层级'),
                    }),
                  },
                ],
                initialValue: organizationType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  onChange={this.onOrganizationTypeChange}
                >
                  {organizationTypeList.map(item => {
                    return (
                      <Select.Option value={item.typeCode} key={item.typeCode}>
                        {item.description}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationCode`).d('组织对象')}
            >
              {getFieldDecorator('organizationCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.organizationCode`).d('组织对象'),
                    }),
                  },
                ],
                initialValue: organizationCode,
              })(
                <Lov
                  code="MT.ORGANIZATION"
                  disabled={isUndefined(newOrganizationType)}
                  queryParams={{ organizationId: tenantId, organizationType: newOrganizationType }}
                  textValue={organizationCode}
                  onChange={this.onOrganizationCodeChange}
                />
              )}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.organizationDesc`).d('组织描述')}
            >
              {getFieldDecorator('organizationDesc', {
                initialValue: organizationDesc,
              })(<Input disabled />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.defaultOrganizationFlag`).d('默认状态')}
            >
              {getFieldDecorator('defaultOrganizationFlag', {
                initialValue: defaultOrganizationFlag !== 'N',
              })(<Switch />)}
            </FormItem>
            <FormItem
              {...DRAWER_FORM_ITEM_LAYOUT}
              label={intl.get(`${modelPrompt}.enableFlag`).d('启用状态')}
            >
              {getFieldDecorator('enableFlag', {
                initialValue: enableFlag !== 'N',
              })(<Switch />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
