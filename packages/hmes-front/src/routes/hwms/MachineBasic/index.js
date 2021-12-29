/**
 * 机台数据维护
 *@date：2019/11/1
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
import { routerRedux } from 'dva/router';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

import FilterForm from './FilterForm';
import DetailDrawer from './DetailDrawer';
import ListTable from './ListTable';

@connect(({ machineBasic, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  machineBasic,
  loading: {
    fetchLoading: loading.effects['machineBasic/queryList'],
    saveLoading: loading.effects['machineBasic/create'],
    updateYLoading: loading.effects['machineBasic/updateY'],
    updateNLoading: loading.effects['machineBasic/updateN'],
  },
}))
@formatterCollections({
  code: ['hwms.machineBasic', 'hwms.barcodeQuery', 'hwms.basicDataMaintain'],
})
class MachineBasic extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showCreateDrawer: false,
      selectedRowKeys: [],
      selectedRows: [], // 选中的数据
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      location: { state: { _back } = {} },
      machineBasic: { pagination },
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'machineBasic/init',
      payload: {
        tenantId,
      },
    });
    // 工厂下拉框
    dispatch({
      type: 'machineBasic/querySiteList',
    });
    // 校验是否从历史页返回
    const page = _back === -1 ? pagination : {};
    // 初始化数据
    this.handleSearch(page);
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'machineBasic/queryList',
      payload: {
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        if (isEmpty(fields)) {
          // 模糊查询
          this.setState({ selectedRowKeys: [], selectedRows: [] });
        }
      }
    });
  }

  /**
   *  是否显示条码新建modal
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
    dispatch({
      type: 'machineBasic/create',
      payload: {
        tenantId,
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
      machineBasic: { pagination },
    } = this.props;
    dispatch({
      type: type === 'Y' ? 'machineBasic/updateY' : 'machineBasic/updateN',
      payload: [...selectedRows],
    }).then(res => {
      if (res.success) {
        notification.success();
        this.setState({ selectedRowKeys: [], selectedRows: [] });
        this.handleSearch(pagination);
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   * 导入
   */
  @Bind()
  handleImport() {
    openTab({
      key: `/hwms/machine-basic/data-import/EQUIPMENT.RELATION.IMPORT2`,
      title: intl.get('hwms.machineBasic.view.message.import').d('机台基础数据导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('机台基础数据导入'),
      }),
    });
  }

  /**
   * 跳转到历史记录
   * @param record
   */
  @Bind()
  handleHistory(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'machineBasic/updateState',
      payload: {
        hisList: [],
        hisPagination: {},
      },
    });
    dispatch(
      routerRedux.push({
        pathname: `/hwms/machine-basic/history/${record.machinePlatformId}`,
      })
    );
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
      machineBasic: {
        dataList = [],
        pagination = [],
        machineTypeMap = [],
        enableFlagMap = [],
        siteMap = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      machineTypeMap,
      enableFlagMap,
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      selectedRowKeys,
      pagination,
      loading: fetchLoading,
      dataSource: dataList,
      onSearch: this.handleSearch,
      onSelectRow: this.handleSelectRow,
      onHistory: this.handleHistory,
    };
    const detailProps = {
      tenantId,
      showCreateDrawer,
      siteMap,
      machineTypeMap,
      saveLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.machineBasic.view.message.title').d('机台基础数据维护')}>
          <Button type="primary" icon="plus" onClick={this.handleModalVisible}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button icon="to-top" onClick={this.handleImport}>
            {intl.get('hzero.common.view.button.import').d('导入')}
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
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          {showCreateDrawer && <DetailDrawer {...detailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default MachineBasic;
