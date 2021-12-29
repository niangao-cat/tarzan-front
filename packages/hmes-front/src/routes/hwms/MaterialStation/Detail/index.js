/**
 * 料站表明细
 *@date：2019/11/5
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';

import CreateDrawer from './CreateDrawer';
import ListTable from './ListTable';

@connect(({ materialStation, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  materialStation,
  loading: {
    fetchLoading: loading.effects['materialStation/queryDetailList'],
    saveLoading: loading.effects['materialStation/createLineData'],
    updateYLoading: loading.effects['materialStation/updateLineY'],
    updateNLoading: loading.effects['materialStation/updateLineN'],
  },
}))
@formatterCollections({
  code: ['hwms.materialStation', 'hwms.barcodeQuery', 'hwms.machineBasic'],
})
class Detail extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showCreateDrawer: false,
      selectedRowKeys: [],
      selectedRows: [], // 选中的数据
      parentItem: props.location.params.parentItem || {},
    };
  }

  componentDidMount() {
    // 初始化数据
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const {
      parentItem: { headId },
    } = this.state;
    dispatch({
      type: 'materialStation/queryDetailList',
      payload: {
        headId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  是否显示新建modal
   */
  @Bind()
  handleModalVisible() {
    const { showCreateDrawer } = this.state;
    this.setState({ showCreateDrawer: !showCreateDrawer });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const { dispatch, tenantId } = this.props;
    const {
      parentItem: { headId },
    } = this.state;
    dispatch({
      type: 'materialStation/createLineData',
      payload: {
        tenantId,
        headId,
        ...params,
      },
    }).then(res => {
      if (res.success) {
        this.handleModalVisible();
        notification.success();
        this.handleSearch();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   *  更新数据状态
   */
  @Bind()
  updateData(type) {
    const { selectedRows } = this.state;
    const {
      dispatch,
      materialStation: { detailPagination },
    } = this.props;
    dispatch({
      type: type === 'Y' ? 'materialStation/updateLineY' : 'materialStation/updateLineN',
      payload: [...selectedRows],
    }).then(res => {
      if (res.success) {
        notification.success();
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        this.handleSearch(detailPagination);
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   * 数据选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  render() {
    const { showCreateDrawer, selectedRowKeys, selectedRows } = this.state;
    const {
      tenantId,
      loading: { fetchLoading, saveLoading, updateYLoading, updateNLoading },
      materialStation: { detailList = [], detailPagination = [] },
    } = this.props;
    const listProps = {
      selectedRowKeys,
      pagination: detailPagination,
      loading: fetchLoading,
      dataSource: detailList,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
    };
    const detailProps = {
      tenantId,
      showCreateDrawer,
      saveLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('hwms.materialStation.view.message.detailTitle').d('料站表维护明细')}
          backPath="/hwms/material-station/query"
        >
          <Button type="primary" icon="plus" onClick={this.handleModalVisible}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            loading={updateNLoading}
            disabled={isEmpty(selectedRows)}
            onClick={() => this.updateData('N')}
          >
            {intl.get('hzero.common.button.disable').d('失效')}
          </Button>
          <Button
            loading={updateYLoading}
            disabled={isEmpty(selectedRows)}
            onClick={() => this.updateData('Y')}
          >
            {intl.get('hzero.common.button.enable').d('启用')}
          </Button>
        </Header>
        <Content>
          <ListTable {...listProps} />
          {showCreateDrawer && <CreateDrawer {...detailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default Detail;
