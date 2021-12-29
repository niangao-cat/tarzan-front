/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Tabs, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { isUndefined } from 'lodash';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import PlanTab from './PlanTab';
import ProduceTab from './ProduceTab';
import FunctionalAttributesTab from './FunctionalAttributesTab';
import AttributeDrawer from './AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.org.workcell.model.workcell';

/**
 * 工作单元明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} workcell - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ workcell }) => ({
  workcell,
}))
@formatterCollections({ code: 'tarzan.org.workcell' })
@Form.create({ fieldNameProp: null })
export default class WorkCellDist extends React.Component {
  form;

  planTab;

  produceTab;

  functionTab;

  state = {
    buttonFlag: true,
    editFlag: true,
    attributeDrawerVisible: false,
    spinLoading: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const workcellId = match.params.id;
    dispatch({
      type: 'workcell/fetchRateTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'RATE_TYPE',
      },
    });
    dispatch({
      type: 'workcell/fetchWorkcellTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'WORKCELL_TYPE',
      },
    });
    if (workcellId === 'create') {
      dispatch({
        type: 'workcell/updateState',
        payload: {
          displayList: {},
          planList: {},
          produceList: {},
          attrList: [],
        },
      });
      return;
    }
    this.fetchWorkcellLineList();
  }

  fetchWorkcellLineList(){
    const { dispatch, match } = this.props;
    const workcellId = match.params.id;
    this.setState({spinLoading: true});
    dispatch({
      type: 'workcell/fetchWorkcellLineList',
      payload: {
        workcellId,
      },
    }).then(()=>{
      this.setState({spinLoading: false});
    });
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
    });
  }

  // 保存全部
  @Bind
  handleSaveAll() {
    const {
      dispatch,
      match,
      history,
      workcell: { displayList = {}, planList = {}, produceList = {}, organizationUnit = {} },
    } = this.props;
    const workcellId = match.params.id === 'create' ? undefined : match.params.id;
    let formValue = this.form.getFieldsValue();
    let planTabValue = this.planTab.getFieldsValue();
    const produceTabValue = isUndefined(this.produceTab) ? {} : this.produceTab.getFieldsValue();
    const functionForm = isUndefined(this.functionTab) ? {} : this.functionTab.getFieldsValue();
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
      this.setState({spinLoading: true});
      dispatch({
        type: 'workcell/saveWorkcell',
        payload: {
          workcell: {
            ...displayList,
            ...formValue,
            enableFlag: formValue.enableFlag ? 'Y' : 'N',
            workcellId,
          },
          organizationUnit: {
            ...organizationUnit,
            organizationId: workcellId,
            relId: organizationUnit.relId,
            ...functionForm,
          },
          workcellSchedule: { ...planList, ...planTabValue },
          workcellManufacturing: { ...produceList, ...produceTabValue, workcellId },
        },
      }).then(res => {
        this.setState({spinLoading: false});
        if (res && res.success) {
          notification.success();
          this.setState({
            editFlag: true,
          });
          history.push(`/organization-modeling/work-cell/dist/${res.rows}`);
          dispatch({
            type: 'workcell/fetchWorkcellLineList',
            payload: {
              workcellId: res.rows,
            },
          });
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

  // 职能属性
  @Bind
  onFunAttrRef(ref = {}) {
    this.functionTab = (ref.props || {}).form;
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const workcellId = match.params.id;
    const { buttonFlag } = this.state;
    if (workcellId === 'create') {
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

  showAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { match, workcell: { organizationUnit = {} } } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const workcellId = match.params.id;
    const { buttonFlag, editFlag, attributeDrawerVisible } = this.state;
    const initProps = {
      workcellId,
      editFlag,
    };

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      workcellId,
      editFlag,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.org.workcell.title.workcell').d('工作单元维护')}
          backPath={`${basePath}/list`}
        >
          <React.Fragment>
            {workcellId === 'create' ? (
              <Button type="primary" icon="save" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.workcell.button.save').d('保存')}
              </Button>
            ) : buttonFlag ? (
              <Button type="primary" icon="edit" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.workcell.button.edit').d('编辑')}
              </Button>
            ) : (
              <Button type="primary" icon="save" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.workcell.button.save').d('保存')}
              </Button>
                )}
            <Button
              icon="arrows-alt"
              onClick={this.showAttrDrawer}
              disabled={workcellId === 'create'}
            >
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </Button>
          </React.Fragment>
        </Header>
        <Content>
          <Spin spinning={this.state.spinLoading}>
            <DisplayForm onRef={this.onRef} {...initProps} />
            <Tabs defaultActiveKey="plan">
              <TabPane tab={intl.get(`${modelPrompt}.plan`).d('计划属性')} key="plan">
                <PlanTab onRef={this.onPlanRef} {...initProps} />
              </TabPane>
              <TabPane tab={intl.get(`${modelPrompt}.produce`).d('生产属性')} key="produce">
                <ProduceTab onRef={this.onProduceRef} {...initProps} />
              </TabPane>
              <TabPane tab={intl.get(`${modelPrompt}.functionalAttributes`).d('职能属性')} key="functionalAttributes">
                <FunctionalAttributesTab organizationUnit={organizationUnit} onRef={this.onFunAttrRef} {...initProps} />
              </TabPane>
            </Tabs>
          </Spin>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
