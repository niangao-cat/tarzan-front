/**
 * SiteDist - 站点明细编辑
 * @date: 2019-8-7
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
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import PlanTab from './PlanTab';
import ProduceTab from './ProduceTab';
import AttrTab from './AttributeTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.site.model.site';

/**
 * 站点明细编辑
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
@formatterCollections({ code: 'tarzan.org.site' })
@Form.create({ fieldNameProp: null })
export default class SiteDist extends React.Component {
  form;

  basicTab;

  planTab;

  produceTab;

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
      type: 'relationMaintainDrawer/fetchSiteTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ORGANIZATION_REL_TYPE',
      },
    });
    if (itemId === 'create') {
      dispatch({
        type: 'relationMaintainDrawer/updateState',
        payload: {
          displayList: {},
          planList: {},
          produceList: {},
          attrList: [],
        },
      });
      return;
    }
    dispatch({
      type: 'relationMaintainDrawer/fetchSiteLineList',
      payload: {
        siteId: itemId,
      },
    });
  }

  @Bind()
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 基础属性
  @Bind()
  onBasicRef(ref = {}) {
    this.basicTab = (ref.props || {}).form;
  }

  // 计划属性
  @Bind()
  onPlanRef(ref = {}) {
    this.planTab = (ref.props || {}).form;
  }

  // 生产属性
  @Bind()
  onProduceRef(ref = {}) {
    this.produceTab = (ref.props || {}).form;
  }

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      itemId,
      relationMaintainDrawer: { displayList = {}, attrList = [], planList = {}, produceList = {} },
    } = this.props;
    const siteId = itemId === 'create' ? undefined : itemId;
    let formValue = this.form.getFieldsValue();
    const basicTabValue = isUndefined(this.basicTab) ? {} : this.basicTab.getFieldsValue();
    const planTabValue = isUndefined(this.planTab) ? {} : this.planTab.getFieldsValue();
    const produceTabValue = isUndefined(this.produceTab) ? {} : this.produceTab.getFieldsValue();
    let planStartTime;
    if (planTabValue.planStartTime) {
      planStartTime = planTabValue.planStartTime.format(DEFAULT_DATETIME_FORMAT);
    }
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
        type: 'relationMaintainDrawer/saveSite',
        payload: {
          site: {
            ...displayList,
            ...basicTabValue,
            ...formValue,
            enableFlag: formValue.enableFlag ? 'Y' : 'N',
            siteId,
          },
          siteSchedule: { ...planList, ...planTabValue, planStartTime },
          siteManufacturing: { ...produceList, ...produceTabValue, siteId },
          siteAttrs: attrList || [],
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
      siteId: itemId,
      editFlag: componentDisabled,
    };
    return (
      <>
        <DisplayForm onRef={this.onRef} {...initProps} />
        <Tabs defaultActiveKey="basic">
          <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
            <BasicTab onRef={this.onBasicRef} {...initProps} />
          </TabPane>
          <TabPane tab={intl.get(`${modelPrompt}.plan`).d('计划属性')} key="plan">
            <PlanTab onRef={this.onPlanRef} {...initProps} />
          </TabPane>
          <TabPane tab={intl.get(`${modelPrompt}.produce`).d('生产属性')} key="produce">
            <ProduceTab onRef={this.onProduceRef} {...initProps} />
          </TabPane>
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
