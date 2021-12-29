/**
 * 基础数据维护
 *@date：2019/10/21
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
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

import PrepareTab from './PrepareTab';
import DeliveryTab from './DeliveryTab';
import StrategyTab from './StrategyTab';

@connect(({ basicDataMaintain }) => ({
  tenantId: getCurrentOrganizationId(),
  basicDataMaintain,
}))
@formatterCollections({ code: 'hwms.basicDataMaintain' })
class BasicDataMaintain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'preparingTab', // 当前tab页
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'basicDataMaintain/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'basicDataMaintain/querySiteList',
    });
    // 查询备料提前期
    dispatch({
      type: 'basicDataMaintain/queryPreparingTime',
    });
  }

  /**
   *  新建
   */
  @Bind()
  handleCreate() {
    const { currentTab } = this.state;
    let payload;
    switch (currentTab) {
      case 'preparingTab':
        payload = {
          showPreDrawer: true,
        };
        break;
      case 'deliveryTab':
        payload = {
          showDelDrawer: true,
        };
        break;
      case 'strategyTab':
        payload = {
          showStrDrawer: true,
        };
        break;
      default:
        break;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'basicDataMaintain/updateState',
      payload: { ...payload, detail: {} },
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

  /**
   * 导入
   */
  @Bind()
  handleImport() {
    openTab({
      key: `/hwms/basic-data-maintain/data-import/Z_BIN_CASE`,
      title: intl.get('hwms.basicDataMaintain.view.message.import').d('配bin方案导入'),
      search: queryString.stringify({
        action: intl.get('hwms.basicDataMaintain.view.message.import').d('配bin方案导入'),
      }),
    });
  }

  render() {
    const modelPrompt = 'hwms.basicDataMaintain.model.basicDataMaintain';
    const { currentTab } = this.state;
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.basicDataMaintain.view.message.title').d('配送基础数据维护')}>
          <Button type="primary" icon="plus" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {currentTab === 'preparingTab' && (
            <Button icon="to-top" onClick={this.handleImport}>
              {intl.get('hwms.basicDataMaintain.view.message.import').d('配bin方案导入')}
            </Button>
          )}
        </Header>
        <Content>
          <Tabs defaultActiveKey="preparingTab" onChange={this.handleTabChange}>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.preparingTab`).d('备料时间设置')}
              key="preparingTab"
            >
              <PrepareTab />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.deliveryTab`).d('送料时间设置')}
              key="deliveryTab"
            >
              <DeliveryTab />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.strategyTab`).d('组件配送策略维护')}
              key="strategyTab"
            >
              <StrategyTab />
            </Tabs.TabPane>
          </Tabs>
        </Content>
      </React.Fragment>
    );
  }
}

export default BasicDataMaintain;
