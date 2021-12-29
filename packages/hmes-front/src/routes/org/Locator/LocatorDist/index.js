/**
 * LocatorDist - 库位明细编辑
 * @date: 2019-8-16
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
 * @reactProps {Object} locator - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ locator }) => ({
  locator,
}))
@formatterCollections({ code: 'org.locator' })
@Form.create({ fieldNameProp: null })
export default class LocatorDist extends React.Component {
  form;

  basicTab;

  state = {
    buttonFlag: true,
    editFlag: true,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const locatorId = match.params.id;
    dispatch({
      type: 'locator/fetchAttritionCalculateStrategyList',
      payload: {
        module: 'MODELING',
        typeGroup: 'ATTRITION_STRATEGY',
      },
    });
    dispatch({
      type: 'locator/fetchLocatorTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_TYPE',
      },
    });
    dispatch({
      type: 'locator/fetchLocatorCategoryList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_CATEGORY',
      },
    });
    if (locatorId === 'create') {
      dispatch({
        type: 'locator/updateState',
        payload: {
          displayList: {},
          attrList: [],
        },
      });
      return;
    }
    dispatch({
      type: 'locator/fetchLocatorLineList',
      payload: {
        locatorId,
      },
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const locatorId = match.params.id;
    const { buttonFlag } = this.state;
    if (locatorId === 'create') {
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

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      match,
      history,
      locator: { displayList = {}, attrList = [] },
    } = this.props;
    const locatorId = match.params.id === 'create' ? undefined : match.params.id;
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
        type: 'locator/saveLocator',
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
          this.setState({
            editFlag: true,
          });
          history.push(`/organization-modeling/locator/dist/${res.rows}`);
          dispatch({
            type: 'locator/fetchLocatorLineList',
            payload: {
              locatorId: res.rows,
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
    const locatorId = match.params.id;
    const { buttonFlag, editFlag } = this.state;
    const initProps = {
      locatorId,
      editFlag,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.org.locator.title.list').d('库位维护')}
          backPath={`${basePath}/list`}
        >
          <React.Fragment>
            {buttonFlag && locatorId !== 'create' ? (
              <Button type="primary" icon="edit" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.locator.button.edit').d('编辑')}
              </Button>
            ) : (
              <Button type="primary" icon="save" onClick={this.toggleEdit}>
                {intl.get('tarzan.org.locator.button.save').d('保存')}
              </Button>
            )}
          </React.Fragment>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} {...initProps} />
          <Tabs defaultActiveKey="basic">
            <TabPane tab={intl.get(`${modelPrompt}.basic`).d('基础属性')} key="basic">
              <BasicTab onRef={this.onBasicRef} {...initProps} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.field`).d('扩展字段')} key="field">
              <AttrTab {...initProps} />
            </TabPane>
          </Tabs>
        </Content>
      </React.Fragment>
    );
  }
}
