/**
 * WorkOrder - 工单派工平台
 * @date: 2020/03/03
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import qs from 'querystring';
import { isEmpty } from 'lodash';

import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import notification from 'utils/notification';
import List from './List';
import EnterModal from './EnterModal';

// const modelPrompt = 'tarzan.hmes.message.model.message';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ toolingManagement, loading }) => ({
  toolingManagement,
  fetchWorkCellInfoLoading: loading.effects['toolingManagement/fetchWorkCellInfo'],
  fetchToolingListLoading: loading.effects['toolingManagement/fetchToolingList'],
  saveLoading: loading.effects['toolingManagement/save'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.message',
})
export default class ToolingManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    if(routerParam.workcellId) {
      this.setState({ visible: false });
      this.handleFetchToolingList({}, routerParam.workcellId);
      dispatch({
        type: 'toolingManagement/updateState',
        payload: {
          workCellInfo: { workcellId: routerParam.workcellId },
        },
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { toolingManagement: { workCellInfo }, dispatch } = this.props;
    const routerParam = qs.parse(nextProps.history.location.search.substr(1));
    if (routerParam.workcellId && (routerParam.workcellId !== workCellInfo.workcellId)) {
      this.handleFetchToolingList({}, routerParam.workcellId);
      dispatch({
        type: 'toolingManagement/updateState',
        payload: {
          workCellInfo: { workcellId: routerParam.workcellId },
        },
      });
    }
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'toolingManagement/updateState',
      payload: {
        toolingList: [],
        pagination: {},
      },
    });
    this.setState({ visible: true });
  }

  @Bind()
  handleFetchWorkCellInfo(workcellCode) {
    const { dispatch } = this.props;
    dispatch({
      type: `toolingManagement/fetchWorkCellInfo`,
      payload: {
        workcellCode,
      },
    }).then(res => {
      if (res) {
        this.handleFetchToolingList();
        this.setState({ visible: false });
      }
    });
  }

  @Bind()
  handleFetchToolingList(page = {}, workcellId) {
    const { dispatch, toolingManagement: { workCellInfo, toolingList } } = this.props;
    const newDataSource = getEditTableData(toolingList);
    const isChangeFlag = newDataSource.every(e => {
      const currentTool = toolingList.find(i => e.toolId === i.toolId);
      if(currentTool.qty === e.qty) {
        return true;
      }
      return false;
    });
    if((!isEmpty(page) && !isChangeFlag) || isEmpty(page)) {
      dispatch({
        type: `toolingManagement/fetchToolingList`,
        payload: {
          workcellId: workcellId || workCellInfo.workcellId,
          page,
        },
      });
    } else {
      notification.warning({ description: '当前页有为保存数据，请先保存数据再翻页'});
    }

  }

  @Bind()
  handleSave() {
    const { dispatch, toolingManagement: { toolingList } } = this.props;
    const newDataSource = getEditTableData(toolingList);
    const isChangeFlag = newDataSource.every(e => {
      const currentTool = toolingList.find(i => e.toolId === i.toolId);
      if(currentTool.qty === e.qty) {
        return true;
      }
      return false;
    });
    if(!isChangeFlag) { // 当前页数据有变动
      dispatch({
        type: 'toolingManagement/save',
        payload: newDataSource,
      }).then(res => {
        if(res) {
          notification.success();
          this.handleFetchToolingList();
        }
      });
    } else {
      notification.warning({ description: '当前数据无变化' });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      saveLoading,
      fetchToolingListLoading,
      fetchWorkCellInfoLoading,
      toolingManagement: { toolingList, pagination },
    } = this.props;
    const { visible } = this.state;
    const enterModalProps = {
      visible,
      loading: false,
      onFetchWorkCellInfo: this.handleFetchWorkCellInfo,
    };
    const listTableProps = {
      dataSource: toolingList,
      pagination,
      loading: saveLoading || fetchToolingListLoading || fetchWorkCellInfoLoading || false,
      onSearch: this.handleFetchToolingList,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.message.title.list').d('工装管理平台')}>
          <Button loading={saveLoading || false} type="default" onClick={() => this.handleSave()}>
            保存
          </Button>
        </Header>
        <Content>
          <List {...listTableProps} />
        </Content>
        <EnterModal {...enterModalProps} />
      </React.Fragment>
    );
  }
}
