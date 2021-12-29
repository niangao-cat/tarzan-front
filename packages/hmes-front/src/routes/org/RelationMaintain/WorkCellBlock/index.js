/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-8-9
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
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import PlanTab from './PlanTab';
import ProduceTab from './ProduceTab';
import AttrTab from './AttributeTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.workcell.model.workcell';

/**
 * 工作单元明细编辑
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
@formatterCollections({ code: 'tarzan.org.workcell' })
@Form.create({ fieldNameProp: null })
export default class WorkCellBlock extends React.Component {
  form;

  planTab;

  produceTab;

  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, itemId } = this.props;
    dispatch({
      type: 'relationMaintainDrawer/fetchRateTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'RATE_TYPE',
      },
    });
    dispatch({
      type: 'relationMaintainDrawer/fetchWorkcellTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'WORKCELL_TYPE',
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
      type: 'relationMaintainDrawer/fetchWorkcellLineList',
      payload: {
        workcellId: itemId,
      },
    });
  }

  // 保存全部
  @Bind
  handleSaveAll() {
    const {
      dispatch,
      itemId,
      relationMaintainDrawer: { displayList = {}, planList = {}, produceList = {}, attrList = [] },
    } = this.props;
    const workcellId = itemId === 'create' ? undefined : itemId;
    let formValue = this.form.getFieldsValue();
    let planTabValue = this.planTab.getFieldsValue();
    const produceTabValue = isUndefined(this.produceTab) ? {} : this.produceTab.getFieldsValue();
    let flag = true;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        formValue = fieldsValue;
      } else {
        flag = false;
      }
    });
    this.planTab.validateFields((err, fieldsValue) => {
      if (!err) {
        planTabValue = fieldsValue;
      } else {
        flag = false;
      }
    });
    if (flag) {
      dispatch({
        type: 'relationMaintainDrawer/saveWorkcell',
        payload: {
          workcell: {
            ...displayList,
            ...formValue,
            enableFlag: formValue.enableFlag ? 'Y' : 'N',
            workcellId,
          },
          workcellSchedule: { ...planList, ...planTabValue },
          workcellManufacturing: { ...produceList, ...produceTabValue, workcellId },
          workcellAttrs: attrList || [],
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

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 计划属性
  @Bind
  onPlanRef(ref = {}) {
    this.planTab = (ref.props || {}).form;
  }

  // 生产属性
  @Bind
  onProduceRef(ref = {}) {
    this.produceTab = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { componentDisabled, itemId } = this.props;
    const initProps = {
      workcellId: itemId,
      editFlag: componentDisabled,
    };
    return (
      <>
        <DisplayForm onRef={this.onRef} {...initProps} />
        <Tabs defaultActiveKey="plan">
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
