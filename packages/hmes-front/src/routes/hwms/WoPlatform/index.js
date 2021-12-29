/**
 * 工单发料平台
 *@date：2019/10/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button, Tabs } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';

import WoTab from './WoTab';
import MaterialTab from './MaterialTab';

@connect(({ woPlatform, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  woPlatform,
  loading: {
    saveLoading: loading.effects['woPlatform/generateData'],
  },
}))
@formatterCollections({ code: 'hwms.woPlatform' })
class WoPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'woTab', // 当前tab页
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'woPlatform/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'woPlatform/querySiteList',
    });
  }

  /**
   * 生成备料单
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      woPlatform: { selectedRows },
    } = this.props;
    dispatch({
      type: 'woPlatform/generateData',
      payload: {
        produceOrderVOList: [...selectedRows],
      },
    }).then(res => {
      if (res.success) {
        notification.success();
        dispatch({
          type: 'woPlatform/updateState',
          payload: {
            selectedRowKeys: [],
            selectedRows: [],
          },
        });
        this.handleHeadSearch();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   *  查询生产订单列表
   */
  @Bind()
  handleHeadSearch() {
    const {
      dispatch,
      woPlatform: { headPagination = {}, filterValues = {} },
    } = this.props;
    dispatch({
      type: 'woPlatform/queryHeadList',
      payload: {
        ...filterValues,
        page: headPagination,
      },
    });
  }

  /**
   * 监听tab页变化
   * @param key
   */
  @Bind()
  handleTabChange(key) {
    this.setState({ currentTab: key });
  }

  render() {
    const modelPrompt = 'hwms.woPlatform.model.woPlatform';
    const { currentTab } = this.state;
    const {
      woPlatform: { selectedRows },
      loading: { saveLoading },
    } = this.props;
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.woPlatform.view.message.title').d('工单发料平台')}>
          {currentTab === 'woTab' && (
            <Button
              type="primary"
              onClick={this.handleCreate}
              disabled={isEmpty(selectedRows)}
              loading={saveLoading}
            >
              {intl.get('hwms.woPlatform.button.create').d('生成备料单')}
            </Button>
          )}
        </Header>
        <Content>
          <Tabs defaultActiveKey="woTab" onChange={this.handleTabChange}>
            <Tabs.TabPane tab={intl.get(`${modelPrompt}.tab.woTab`).d('生产订单查询')} key="woTab">
              <WoTab />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.materialTab`).d('备料单查询')}
              key="materialTab"
            >
              <MaterialTab />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </React.Fragment>
    );
  }
}

export default WoPlatform;
