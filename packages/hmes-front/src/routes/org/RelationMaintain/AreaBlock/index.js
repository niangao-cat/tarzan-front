/**
 * AreaDist - 区域明细编辑
 * @date: 2019-8-8
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { isNull } from 'lodash';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import PlanTab from './PlanTab';
import PurchaseTab from './PurchaseTab';
import AttributeTab from './AttributeTab';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.area.model.area';

/**
 * 区域明细编辑
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
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class AreaDist extends React.Component {
  form;

  basicForm;

  planForm;

  purchanseForm;

  componentDidMount() {
    this.props.onRef(this);
    const { dispatch, itemId } = this.props;
    dispatch({ type: 'relationMaintainDrawer/InitSelectValue' });
    dispatch({
      type: 'relationMaintainDrawer/fetchAreaDetailedInfo',
      payload: {
        areaId: itemId,
      },
    });
    dispatch({
      type: 'relationMaintainDrawer/fetchAttributeList',
      payload: {
        kid: itemId === 'create' ? '' : itemId,
        tableName: 'mt_mod_area_attr',
      },
    });
  }

  // 保存
  @Bind()
  handleSaveAll() {
    const { dispatch, itemId } = this.props;
    let dto = {};
    if (itemId !== 'create') {
      dto.areaId = itemId;
    }
    dto.areaAttrList = isNull(this.props.relationMaintainDrawer.attrList)
      ? []
      : this.props.relationMaintainDrawer.attrList;
    this.form.validateFields((error, fieldValues) => {
      if (error) {
        return;
      }
      dto = { ...fieldValues, ...dto };
      dto.enableFlag = dto.enableFlag ? 'Y' : 'N';
      this.basicForm.validateFields((_, values) => {
        dto = { ...values, ...dto };
      });
      if (this.planForm) {
        this.planForm.validateFields((_, values) => {
          dto = {
            mtModAreaScheduleDTO: {
              ...values,
              planStartTime: values.planStartTime.format('YYYY-MM-DD HH:mm:ss'),
            },
            ...dto,
          };
        });
      }
      if (this.purchanseForm) {
        this.purchanseForm.validateFields((_, values) => {
          dto = { mtModAreaPurchaseDTO: { ...values }, ...dto };
        });
      }
      dispatch({
        type: 'relationMaintainDrawer/saveAreaDetailedInfo',
        payload: {
          ...dto,
        },
      }).then(res => {
        if (res && res.success) {
          this.props.saveSuccessCallBack();
        }
      });
    });
  }

  @Bind()
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 基础属性
  @Bind()
  onBasicRef(ref = {}) {
    this.basicForm = (ref.props || {}).form;
  }

  // 计划属性
  @Bind()
  onPlanRef(ref = {}) {
    this.planForm = (ref.props || {}).form;
  }

  // 生产属性
  @Bind()
  onPurchaseRef(ref = {}) {
    this.purchanseForm = (ref.props || {}).form;
  }

  // 扩展字段
  @Bind()
  onFieldRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { componentDisabled, itemId } = this.props;
    const initProps = {
      areaId: itemId,
      componentDisabled,
    };
    return (
      <React.Fragment>
        <DisplayForm onRef={this.onRef} {...initProps} />
        <Tabs defaultActiveKey="basic">
          <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
            <BasicTab onRef={this.onBasicRef} {...initProps} />
          </TabPane>
          <TabPane tab={intl.get(`${modelPrompt}.plan`).d('计划属性')} key="plan">
            <PlanTab onRef={this.onPlanRef} {...initProps} />
          </TabPane>
          <TabPane tab={intl.get(`${modelPrompt}.purchase`).d('采购属性')} key="purchase">
            <PurchaseTab onRef={this.onPurchaseRef} {...initProps} />
          </TabPane>
          <TabPane
            tab={intl.get(`${modelPrompt}.field`).d('扩展字段')}
            key="field"
            style={{ padding: '0 20px' }}
          >
            <AttributeTab {...initProps} />
          </TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}
