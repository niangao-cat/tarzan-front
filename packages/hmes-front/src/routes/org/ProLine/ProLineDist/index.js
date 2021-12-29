/**
 * WorkCellDist - 生产线明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import PlanTab from './PlanTab';
import ProduceTab from './ProduceTab';
import AttributeDrawer from '@/components/AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.proline.model.proline';
const TABLENAME = 'mt_mod_production_line_attr';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} proline - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ proline, loading }) => ({
  proline,
  saveLoading: loading.effects['proline/saveProLine'],
}))
@formatterCollections({ code: 'tarzan.org.proline' })
@Form.create({ fieldNameProp: null })
export default class WorkCellDist extends React.Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const prodLineId = match.params.id;
    if (prodLineId === 'create') {
      dispatch({
        type: 'proline/fetchAttributeList',
        payload: {
          kid: null,
          tableName: 'mt_mod_production_line_attr',
        },
      });
      this.setState({
        canEdit: true,
      });
      return;
    }
    dispatch({
      type: 'proline/fetchRecordDetail',
      payload: {
        prodLineId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'proline/updateState',
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
  handleSaveBomList = () => {
    const {
      dispatch,
      proline: { prodLineManufacturing = {}, prodLineSchedule = {} },
      match,
      history,
    } = this.props;
    const prodLineId = match.params.id;
    let flag = false;
    this.form.validateFieldsAndScroll(err => {
      if (err) {
        flag = true;
      }
    });

    // if (!this.planForm && prodLineId === 'create') {
    //   flag = true;
    // } else
    if (this.planForm) {
      this.planForm.validateFieldsAndScroll(err => {
        if (err) {
          flag = true;
        }
      });
    }

    if (!flag) {
      dispatch({
        type: 'proline/saveProLine',
        payload: {
          productionLine: {
            ...this.form.getFieldsValue(),
            ...(this.basicForm || {}).getFieldsValue(),
            prodLineId: prodLineId === 'create' ? '' : prodLineId,
            enableFlag: this.form.getFieldValue('enableFlag') ? 'Y' : 'N',
          },
          prodLineManufacturing: this.produceForm
            ? {
                ...this.produceForm.getFieldsValue(),
                prodLineId: prodLineId === 'create' ? '' : prodLineId,
              }
            : prodLineManufacturing,
          prodLineSchedule: this.planForm
            ? {
                ...this.planForm.getFieldsValue(),
                prodLineId: prodLineId === 'create' ? '' : prodLineId,
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
          this.setState({
            canEdit: false,
          });
          history.push(`/organization-modeling/pro-line/dist/${res.rows}`);
          dispatch({
            type: 'proline/fetchRecordDetail',
            payload: {
              prodLineId: res.rows,
            },
          });
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  };

  /**
   *@functionName:   changEditStatus
   *@description: 修改编辑状态
   *@author: 唐加旭
   *@date: 2019-08-24 10:43:00
   *@version: V0.0.1
   * */
  changEditStatus = () => {
    this.setState({
      canEdit: true,
    });
  };

  /**
   * @functionName: openAttrDrawer
   * @description: 设置抽屉打开
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  openAttrDrawer = () => {
    const { dispatch, match } = this.props;
    const prodLineId = match.params.id;

    dispatch({
      type: 'proline/fetchAttributeList',
      payload: {
        kid: prodLineId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attributeDrawerVisible: true,
        });
      }
    });
  };

  /**
   * @functionName: closeAttrDrawer
   * @description: 设置抽屉关闭
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  closeAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  /**
   * @functionName: handleSave
   * @description 保存扩展字段
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  handleSave = dataSource => {
    const { dispatch, match } = this.props;
    const prodLineId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'proline/saveAttribute',
        payload: {
          kid: prodLineId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      saveLoading,
      proline: { prodLineAttrs = [] },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const prodLineId = match.params.id;
    const { canEdit, attributeDrawerVisible } = this.state;
    const initProps = {
      prodLineId,
      canEdit,
    };

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: prodLineId,
      canEdit,
      attrList: prodLineAttrs,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    return (
      <>
        <Header
          title={intl.get('tarzan.org.proline.title.detail').d('生产线维护')}
          backPath={`${basePath}/list`}
        >
          {!canEdit ? (
            <Button type="primary" icon="edit" onClick={this.changEditStatus}>
              {intl.get('tarzan.org.proline.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button
              type="primary"
              icon="save"
              loading={saveLoading}
              onClick={this.handleSaveBomList}
            >
              {intl.get('tarzan.org.proline.button.save').d('保存')}
            </Button>
          )}
          <Button
            icon="arrows-alt"
            onClick={this.openAttrDrawer}
            disabled={prodLineId === 'create'}
          >
            {intl.get(`${modelPrompt}.field`).d('扩展字段')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} {...initProps} />
          <Tabs defaultActiveKey="basic">
            <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
              <BasicTab onRef={this.onBasicRef} canEdit={canEdit} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.plan`).d('计划属性')} key="plan">
              <PlanTab onRef={this.onPlanRef} {...initProps} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.produce`).d('生产属性')} key="produce">
              <ProduceTab onRef={this.onProduceRef} {...initProps} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
      </>
    );
  }
}
