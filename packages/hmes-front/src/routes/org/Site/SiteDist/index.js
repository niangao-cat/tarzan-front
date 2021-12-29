/**
 * SiteDist - 站点明细编辑
 * @date: 2019-8-7
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
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
 * @reactProps {Object} site - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ site }) => ({
  site,
}))
@formatterCollections({ code: 'tarzan.org.site' })
@Form.create({ fieldNameProp: null })
export default class SiteDist extends React.Component {
  form;

  basicTab;

  planTab;

  produceTab;

  state = {
    buttonFlag: true,
    editFlag: true,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const siteId = match.params.id;
    dispatch({
      type: 'site/fetchAttritionCalculateStrategyList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ATTRITION_STRATEGY',
      },
    });
    dispatch({
      type: 'site/fetchSiteTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ORGANIZATION_REL_TYPE',
      },
    });
    if (siteId === 'create') {
      dispatch({
        type: 'site/updateState',
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
      type: 'site/fetchSiteLineList',
      payload: {
        siteId,
      },
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const siteId = match.params.id;
    const { buttonFlag } = this.state;
    if (siteId === 'create') {
      this.handleSaveAll();
    } else {
      this.setState({ buttonFlag: !buttonFlag });
      if (buttonFlag) {
        this.handleEdit();
      } else {
        this.handleSaveAll();
      }
    }
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
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

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      match,
      history,
      site: { displayList = {}, attrList = [], planList = {}, produceList = {} },
    } = this.props;
    const siteId = match.params.id === 'create' ? undefined : match.params.id;
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
        type: 'site/saveSite',
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
          this.setState({
            editFlag: true,
          });
          history.push(`/organization-modeling/site/dist/${res.rows}`);
          dispatch({
            type: 'site/fetchSiteLineList',
            payload: {
              siteId: res.rows,
            },
          });
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
    const { match } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const siteId = match.params.id;
    const { buttonFlag, editFlag } = this.state;
    const initProps = {
      siteId,
      editFlag,
    };
    return (
      <>
        <Header
          title={intl.get('tarzan.org.site.title.list').d('站点维护')}
          backPath={`${basePath}/list`}
        >
          {buttonFlag && siteId !== 'create' ? (
            <Button type="primary" icon="edit" onClick={this.toggleEdit}>
              {intl.get('tarzan.org.site.button.edit').d('编辑')}
            </Button>
          ) : (
            <Button type="primary" icon="save" onClick={this.toggleEdit}>
              {intl.get('tarzan.org.site.button.save').d('保存')}
            </Button>
          )}
        </Header>
        <Content>
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
            <TabPane tab={intl.get(`${modelPrompt}.field`).d('扩展字段')} key="field">
              <AttrTab {...initProps} />
            </TabPane>
          </Tabs>
        </Content>
      </>
    );
  }
}
