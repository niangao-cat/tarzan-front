/**
 * WorkCellDist - 执行作业明细编辑
 * @date: 2019-8-9
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Tabs, Menu, Dropdown } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import RoutingTab from './RoutingTab';
import BomTab from './BomTab';
import AttributeDrawer from './AttributeDrawer';
import ExecuteJobTab from './ExecuteJobTab';
import StepTab from './StepTab';
import SplitDrawer from './SplitDrawer';
import MergeDrawer from './MergeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.workshop.execute.model.execute';

/**
 * 执行作业明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} execute - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ execute }) => ({
  execute,
}))
@formatterCollections({ code: 'tarzan.workshop.execute' })
export default class ExecuteDetail extends React.Component {
  state = {
    buttonFlag: true,
    editFlag: true,
    attributeDrawerVisible: false,
    splitDrawerVisible: false,
    mergeDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const eoId = match.params.id;
    dispatch({
      type: 'execute/fetchDetailList',
      payload: {
        eoId,
      },
    }).then(res => {
      if (res && res.success && res.rows && res.rows.eoRouterId) {
        dispatch({
          type: 'execute/fetchRoutingList',
          payload: {
            routerId: res.rows.eoRouterId,
          },
        });
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'execute/updateState',
      payload: {
        displayList: {},
        routingList: [],
        routingPagination: {},
        stepList: [],
        stepPagination: {},
        executeJobList: [],
        executeJobPagination: {},
        bomList: [],
        bomListPagination: {},
      },
    });
  }

  onSearch = () => {
    const { dispatch, match } = this.props;
    const eoId = match.params.id;
    dispatch({
      type: 'execute/fetchDetailList',
      payload: {
        eoId,
      },
    });
  };

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
      execute: { displayList = {} },
    } = this.props;
    dispatch({
      type: 'execute/saveExecute',
      payload: {
        ...displayList,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({
          editFlag: true,
        });
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { buttonFlag } = this.state;
    this.setState({ buttonFlag: !buttonFlag });
    if (buttonFlag) {
      this.handleEdit();
    } else {
      this.handleSaveAll();
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
    this.setState({ attributeDrawerVisible: false, buttonFlag: true, editFlag: true });
  }

  showSplitDrawer = () => {
    this.setState({
      splitDrawerVisible: true,
    });
  };

  // 关闭拆分抽屉
  @Bind
  handleSplitDrawerCancel() {
    this.setState({ splitDrawerVisible: false });
  }

  // 关闭拆分抽屉
  @Bind
  handleSplitDrawerOk(val) {
    this.setState({ splitDrawerVisible: false });
    this.refreshDetail(val);
  }

  // 整个界面刷新
  refreshDetail = val => {
    const { dispatch, history } = this.props;
    history.push(`/hmes/workshop/execute-operation-management/detail/${val}`);
    dispatch({
      type: 'execute/updateState',
      payload: {
        routingList: [],
        routingPagination: {},
        stepList: [],
        stepPagination: {},
        executeJobList: [],
        executeJobPagination: {},
        bomList: [],
        bomListPagination: {},
      },
    });
    dispatch({
      type: 'execute/fetchDetailList',
      payload: {
        eoId: val,
      },
    }).then(res => {
      if (res && res.success && res.rows.eoRouterId) {
        dispatch({
          type: 'execute/fetchRoutingList',
          payload: {
            routerId: res.rows.eoRouterId,
          },
        });
      }
    });
  };

  showMergeDrawer = () => {
    this.setState({
      mergeDrawerVisible: true,
    });
  };

  // 关闭合并抽屉
  @Bind
  handleMergeDrawerCancel() {
    this.setState({ mergeDrawerVisible: false });
  }

  // 关闭合并抽屉
  @Bind
  handleMergeDrawerOk(val) {
    this.setState({ mergeDrawerVisible: false });
    this.refreshDetail(val);
  }

  // 执行作业状态变更
  updateExecuteStatus = operationType => {
    const { dispatch, match } = this.props;
    const eoId = match.params.id;
    dispatch({
      type: 'execute/updateExecuteStatus',
      payload: {
        operationType,
        eoIds: [eoId],
      },
    }).then(res => {
      if (res && res.success) {
        this.onSearch();
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      execute: { displayList = {} },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/detail'));
    const eoId = match.params.id;
    const {
      buttonFlag,
      editFlag,
      attributeDrawerVisible,
      splitDrawerVisible,
      mergeDrawerVisible,
    } = this.state;
    const { eoRouterId, status } = displayList;
    const initProps = {
      eoId,
      editFlag,
      eoRouterId,
    };

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      eoId,
      editFlag,
      status,
    };

    // 拆分抽屉参数
    const splitDrawerProps = {
      visible: splitDrawerVisible,
      onCancel: this.handleSplitDrawerCancel,
      onOk: this.handleSplitDrawerOk,
      eoId,
      editFlag,
    };
    // 合并抽屉参数
    const mergeDrawerProps = {
      visible: mergeDrawerVisible,
      onCancel: this.handleMergeDrawerCancel,
      onOk: this.handleMergeDrawerOk,
      eoId,
      editFlag,
    };

    const statusMenu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.updateExecuteStatus('RELEASE')}
          >
            {intl.get('tarzan.workshop.execute.button.issued').d('下达')}
          </a>
        </Menu.Item>
        <Menu.Item>
          {status === 'WORKING' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('EO_WORKING_CANCEL')}
              // disabled={!(status === 'HOLD'||status==='RELEASE')}
            >
              {intl.get('tarzan.workshop.execute.button.workingCancel').d('取消运行')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('WORKING')}
              // disabled={!(status === 'HOLD'||status==='RELEASE')}
            >
              {intl.get('tarzan.workshop.execute.button.working').d('运行')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'HOLD' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('HOLD_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.holdCancel').d('取消保留')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('HOLD')}
            >
              {intl.get('tarzan.workshop.execute.button.hold').d('保留')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'COMPLETED' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('COMPLETED_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.completeCancel').d('取消完成')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('COMPLETED')}
            >
              {intl.get('tarzan.workshop.execute.button.complete').d('完成')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {status === 'CLOSED' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('CLOSE_CANCEL')}
            >
              {intl.get('tarzan.workshop.execute.button.closeCancel').d('取消关闭')}
            </a>
          ) : (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.updateExecuteStatus('CLOSE')}
            >
              {intl.get('tarzan.workshop.execute.button.close').d('关闭')}
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.updateExecuteStatus('ABANDON')}
          >
            {intl.get('tarzan.workshop.execute.button.abandoned').d('废弃')}
          </a>
        </Menu.Item>
      </Menu>
    );
    const splitMergeMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.showSplitDrawer}>
            {intl.get('tarzan.workshop.execute.button.split').d('拆分')}
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={this.showMergeDrawer}>
            {intl.get('tarzan.workshop.execute.button.merge').d('合并')}
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Header
          title={intl.get('tarzan.workshop.execute.title.list').d('执行作业管理')}
          backPath={`${basePath}/list`}
        >
          <>
            {buttonFlag ? (
              <Button
                type="primary"
                icon="edit"
                onClick={this.toggleEdit}
                disabled={status === 'CLOSED' || status === 'ABANDON'}
              >
                {intl.get('tarzan.workshop.execute.button.edit').d('编辑')}
              </Button>
            ) : (
              <Button
                type="primary"
                icon="save"
                onClick={this.toggleEdit}
                disabled={status === 'CLOSED' || status === 'ABANDON'}
              >
                {intl.get('tarzan.workshop.execute.button.save').d('保存')}
              </Button>
            )}
            <Dropdown
              overlay={statusMenu}
              trigger={['click']}
              disabled={status === 'CLOSED' || status === 'ABANDON' || !buttonFlag}
            >
              <Button icon="retweet">
                {intl.get('tarzan.workshop.execute.button.changeStatus').d('状态变更')}
              </Button>
            </Dropdown>
            <Dropdown
              overlay={splitMergeMenu}
              trigger={['click']}
              icon="verticle-left"
              disabled={
                !(
                  status === 'NEW' ||
                  status === 'RELEASED' ||
                  status === 'WORKING' ||
                  status === 'HOLD'
                ) ||
                status === 'CLOSED' ||
                status === 'ABANDON' ||
                !buttonFlag
              }
            >
              <Button icon="verticle-left">
                {intl.get('tarzan.workshop.execute.button.splitMerge').d('拆分合并')}
              </Button>
            </Dropdown>
            <Button icon="arrows-alt" onClick={this.showAttrDrawer}>
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </Button>
          </>
        </Header>
        <Content>
          <DisplayForm {...initProps} />
          <Tabs defaultActiveKey="plan">
            <TabPane tab={intl.get(`${modelPrompt}.routing`).d('工艺路线')} key="routing">
              <RoutingTab {...initProps} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.bom`).d('装配清单')} key="bom">
              <BomTab {...initProps} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.step`).d('步骤实绩')} key="step">
              <StepTab {...initProps} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.executeJob`).d('执行作业关系')} key="executeJob">
              <ExecuteJobTab {...initProps} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
          {splitDrawerVisible && <SplitDrawer {...splitDrawerProps} />}
          {mergeDrawerVisible && <MergeDrawer {...mergeDrawerProps} />}
        </Content>
      </>
    );
  }
}
