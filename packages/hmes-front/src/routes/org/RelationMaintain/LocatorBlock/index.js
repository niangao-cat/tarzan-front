/**
 * LocatorDist - 库位明细编辑
 * @date: 2019-8-16
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import AttrTab from './AttributeTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.locator.model.locator';

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
@formatterCollections({ code: 'tarzan.org.locator' })
@Form.create({ fieldNameProp: null })
export default class LocatorBlock extends React.Component {
  form;

  basicTab;

  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, itemId } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchAttritionCalculateStrategyList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ATTRITION_STRATEGY',
      },
    });
    dispatch({
      type: 'relationMaintainDrawer/fetchLocatorTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_TYPE',
      },
    });
    dispatch({
      type: 'relationMaintainDrawer/fetchLocatorCategoryList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_CATEGORY',
      },
    });
    if (itemId === 'create') {
      dispatch({
        type: 'relationMaintainDrawer/updateState',
        payload: {
          displayList: {},
          attrList: [],
        },
      });
      return;
    }
    dispatch({
      type: 'relationMaintainDrawer/fetchLocatorLineList',
      payload: {
        locatorId: itemId,
      },
    });
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
      relationMaintainDrawer: { displayList = {}, attrList = [] },
    } = this.props;
    const locatorId = itemId === 'create' ? undefined : itemId;
    let formValue = this.form.getFieldsValue();
    const basicTabValue = isUndefined(this.basicTab) ? {} : this.basicTab.getFieldsValue();
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
        type: 'relationMaintainDrawer/saveLocator',
        payload: {
          ...displayList,
          ...basicTabValue,
          ...formValue,
          enableFlag: formValue.enableFlag ? 'Y' : 'N',
          negativeFlag: formValue.negativeFlag ? 'Y' : 'N',
          locatorId,
          locatorAttrList: attrList || [],
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
      locatorId: itemId,
      editFlag: componentDisabled,
    };
    return (
      <React.Fragment>
        <DisplayForm onRef={this.onRef} {...initProps} />
        <Tabs defaultActiveKey="basic">
          <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
            <BasicTab onRef={this.onBasicRef} {...initProps} />
          </TabPane>
          <TabPane
            tab={intl.get(`${modelPrompt}.field`).d('扩展字段')}
            key="field"
            style={{ padding: '0 20px' }}
          >
            <AttrTab {...initProps} />
          </TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
