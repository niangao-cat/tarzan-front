/**
 * AreaDist - 区域明细编辑
 * @date: 2019-8-8
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import BasicTab from './BasicTab';
import PlanTab from './PlanTab';
import PurchaseTab from './PurchaseTab';
import Distribution from './Distribution';
import AttributeDrawer from './AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.area.model.area';

/**
 * 区域明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} area - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ area }) => ({
  area,
}))
@formatterCollections({
  code: ['tarzan.org.area'], // code 为 [服务].[功能]的字符串数组
})
@Form.create({ fieldNameProp: null })
export default class AreaDist extends React.Component {
  state = {
    componentDisabled: true,
    attributeDrawerVisible: false,
  };

  form;

  basicForm;

  planForm;

  purchanseForm;

  componentDidMount() {
    const { dispatch, match } = this.props;
    const areaId = match.params.id;
    if (areaId === 'create') {
      this.setState({
        componentDisabled: false,
      });
    }
    dispatch({ type: 'area/InitSelectValue' });
    dispatch({
      type: 'area/fetchAreaDetailedInfo',
      payload: {
        areaId,
      },
    });
    // 获取值集
    dispatch({
      type: 'area/getTypeLov',
      payload: {
        areaCategoryList: 'MT.AERA_CATEGORY',
      },
    });
  }

  // 编辑
  @Bind()
  toggleEdit() {
    this.setState({
      componentDisabled: false,
    });
  }

  // 保存
  @Bind()
  handleSaveBomList() {
    const {
      dispatch,
      match,
      history,
      // area: { attrList = [] },
    } = this.props;
    let dto = {};
    const areaId = match.params.id;
    if (areaId !== 'create') {
      dto.areaId = areaId;
    }
    // dto.areaAttrList = attrList;
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
              planStartTime: values.planStartTime
                ? values.planStartTime.format('YYYY-MM-DD HH:mm:ss')
                : '',
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
      if (this.distributionForm) {
        this.distributionForm.validateFields((_, values) => {
          dto = { mtModAreaDistributionDTO: { ...values }, ...dto };
        });
      }
      dispatch({
        type: 'area/saveAreaDetailedInfo',
        payload: {
          ...dto,
        },
      }).then(res => {
        if (res && res.success) {
          history.push({ pathname: `/organization-modeling/area/dist/${res.rows.areaId}` });
          dispatch({
            type: 'fetchAreaDetailedInfo',
            payload: {
              areaId: res.rows.areaId,
            },
          });
          this.setState({
            componentDisabled: true,
          });
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

  // 配送属性
  onDistributionRef = (ref = {}) => {
    this.distributionForm = (ref.props || {}).form;
  };

  // 扩展字段
  @Bind()
  onFieldRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  showAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  onCancel = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { componentDisabled, attributeDrawerVisible } = this.state;
    const {
      match,
      area: { lovData = {} },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const areaId = match.params.id;
    const initProps = {
      areaId,
      componentDisabled,
    };
    const drawerInitProps = {
      areaId,
      componentDisabled,
      visible: attributeDrawerVisible,
      onCancel: this.onCancel,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.org.area.title.detail').d('区域明细')}
          backPath={`${basePath}/list`}
        >
          <React.Fragment>
            {componentDisabled ? (
              <Button type="primary" icon="edit" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.area.button.edit').d('编辑')}
              </Button>
            ) : (
              <Button type="primary" icon="save" onClick={this.handleSaveBomList}>
                {intl.get('tarzan.org.area.button.save').d('保存')}
              </Button>
            )}
            <Button icon="arrows-alt" onClick={this.showAttrDrawer} disabled={areaId === 'create'}>
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </Button>
          </React.Fragment>
        </Header>
        <Content>
          <DisplayForm
            onRef={this.onRef}
            {...initProps}
            areaCategoryList={lovData.areaCategoryList}
          />
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
            <TabPane tab={intl.get(`${modelPrompt}.distribution`).d('配送属性')} key="distribution">
              <Distribution onRef={this.onDistributionRef} {...initProps} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...drawerInitProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
