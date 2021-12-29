/**
 * LocatorDist - 库位明细编辑
 * @date: 2019-8-16
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import DisplayForm from './DisplayForm';
import AttrTab from './AttributeTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.locatorGroup.model.locatorGroup';

/**
 * 库位明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} relationMaintainDrawer - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.locatorGroup' })
@Form.create({ fieldNameProp: null })
export default class LocatorGroupBlock extends React.Component {
  form;

  componentDidMount() {
    this.props.onRef(this);
    // const { dispatch, itemId } = this.props;
    // dispatch({
    //   type: 'relationMaintainDrawer/fetchLocatorGroupDetails',
    //   payload: {
    //     locatorGroupId: itemId,
    //   },
    // });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 基础属性
  @Bind
  onBasicRef(ref = {}) {
    this.basicTab = (ref.props || {}).form;
  }

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      itemId,
      relationMaintainDrawer: { attrList = [] },
    } = this.props;
    const locatorGroupId = itemId === 'create' ? undefined : itemId;
    let formValue = this.form.getFieldsValue();
    let flag = true;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        formValue = fieldsValue;
      } else {
        flag = false;
      }
    });
    if (flag) {
      dispatch({
        type: 'relationMaintainDrawer/saveLocatorGroup',
        payload: {
          locatorGroupInfo: {
            ...formValue,
            enableFlag: formValue.enableFlag ? 'Y' : 'N',
            locatorGroupId,
          },
          attrs: attrList || [],
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.props.saveSuccessCallBack();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { componentDisabled, itemId } = this.props;
    const initProps = {
      locatorGroupId: itemId,
      editFlag: componentDisabled,
    };
    return (
      <>
        <DisplayForm onRef={this.onRef} {...initProps} />
        <Tabs defaultActiveKey="field">
          <TabPane
            tab={intl.get(`${modelPrompt}.field`).d('扩展字段')}
            key="field"
            style={{ padding: '0 20px' }}
          >
            <AttrTab {...initProps} />
          </TabPane>
        </Tabs>
      </>
    );
  }
}
