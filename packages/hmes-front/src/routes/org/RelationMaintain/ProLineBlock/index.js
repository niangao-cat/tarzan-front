/**
 * ProLineBlock - 生产线明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import notification from 'utils/notification';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import PlanTab from './PlanTab';
import ProduceTab from './ProduceTab';
import ExtendedTab from './ExtendedTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.proline.model.proline';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} relationMaintainDrawer - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ relationMaintainDrawer }) => ({
  relationMaintainDrawer,
}))
@formatterCollections({ code: 'tarzan.org.proline' })
@Form.create({ fieldNameProp: null })
export default class ProLineBlock extends React.Component {
  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, itemId } = this.props;
    if (itemId === 'create') {
      dispatch({
        type: 'relationMaintainDrawer/fetchProdLineAttributeList',
        payload: {
          kid: null,
          tableName: 'mt_mod_production_line_attr',
        },
      });
      return;
    }
    dispatch({
      type: 'relationMaintainDrawer/fetchRecordDetail',
      payload: {
        prodLineId: itemId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/updateState',
      payload: {
        prodLineAttrs: [],
        prodLineManufacturing: {},
        prodLineSchedule: {},
        productionLine: {},
        proLineItem: {},
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
    this.basicForm = (ref.props || {}).form;
  }

  // 计划属性
  @Bind
  onPlanRef(ref = {}) {
    this.planForm = (ref.props || {}).form;
  }

  // 生产属性
  @Bind
  onProduceRef(ref = {}) {
    this.produceForm = (ref.props || {}).form;
  }

  // 扩展字段
  @Bind
  onFieldRef(ref = {}) {
    this.fieldForm = (ref.props || {}).form;
  }

  /**
   *@functionName:   handleSaveBomList
   *@description 保存当前数据
   *@author: 唐加旭
   *@date: 2019-08-19 17:16:03
   *@version: V0.0.1
   * */
  handleSaveAll = () => {
    const {
      dispatch,
      itemId,
      relationMaintainDrawer: {
        prodLineAttrs = [],
        prodLineManufacturing = {},
        prodLineSchedule = {},
      },
    } = this.props;
    let flag = false;
    this.form.validateFieldsAndScroll(err => {
      if (err) {
        flag = true;
      }
    });

    if (this.planForm) {
      this.planForm.validateFieldsAndScroll(err => {
        if (err) {
          flag = true;
        }
      });
    }

    if (!flag) {
      dispatch({
        type: 'relationMaintainDrawer/saveProLine',
        payload: {
          prodLineAttrs,
          productionLine: {
            ...this.form.getFieldsValue(),
            ...(this.basicForm || {}).getFieldsValue(),
            prodLineId: itemId === 'create' ? '' : itemId,
            enableFlag: this.form.getFieldValue('enableFlag') ? 'Y' : 'N',
          },
          prodLineManufacturing: this.produceForm
            ? {
                ...this.produceForm.getFieldsValue(),
                prodLineId: itemId === 'create' ? '' : itemId,
              }
            : prodLineManufacturing,
          prodLineSchedule: this.planForm
            ? {
                ...this.planForm.getFieldsValue(),
                prodLineId: itemId === 'create' ? '' : itemId,
              }
            : Object.keys(prodLineSchedule).length === 0
            ? {
                activity: 100,
              }
            : prodLineSchedule,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.props.saveSuccessCallBack();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { componentDisabled, itemId } = this.props;
    const initProps = {
      prodLineId: itemId,
      canEdit: componentDisabled,
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
            <ExtendedTab onRef={this.onFieldRef} {...initProps} />
          </TabPane>
        </Tabs>
      </>
    );
  }
}
