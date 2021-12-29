/**
 * 锡膏/红胶管理
 *@date：2019/10/30
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

import QueryTab from './QueryTab';
import ManageTab from './ManageTab';
import ProductLineDrawer from './ProductLineDrawer/ProductLineDrawer';

@connect(({ solderGlueManage }) => ({
  tenantId: getCurrentOrganizationId(),
  solderGlueManage,
}))
@formatterCollections({ code: 'hwms.solderGlueManage' })
class SolderGlueManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'queryTab', // 当前tab页
      showModalVisible: false, // 是否显示产线数据查询modal
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'solderGlueManage/init',
      payload: {
        tenantId,
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

  /**
   *  控制产线数据查询modal
   */
  @Bind()
  handleModalVisible() {
    const { showModalVisible } = this.state;
    this.setState({ showModalVisible: !showModalVisible });
  }

  render() {
    const modelPrompt = 'hwms.solderGlueManage.model.solderGlueManage';
    const { currentTab, showModalVisible } = this.state;
    const modalProps = {
      visible: showModalVisible,
      onCancel: this.handleModalVisible,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.solderGlueManage.view.message.title').d('锡膏/红胶管理')}>
          {currentTab === 'queryTab' && (
            <Button type="primary" onClick={this.handleModalVisible}>
              {intl.get('hwms.solderGlueManage.button.productLine').d('产线数据查询')}
            </Button>
          )}
        </Header>
        <Content>
          <Tabs defaultActiveKey="queryTab" onChange={this.handleTabChange}>
            <Tabs.TabPane
              tab={intl.get(`${modelPrompt}.tab.queryTab`).d('锡膏/红胶查询')}
              key="queryTab"
            >
              <QueryTab />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={intl.get('hwms.solderGlueManage.view.message.title').d('锡膏/红胶管理')}
              key="manageTab"
            >
              <ManageTab />
            </Tabs.TabPane>
          </Tabs>
          {showModalVisible && <ProductLineDrawer {...modalProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default SolderGlueManage;
