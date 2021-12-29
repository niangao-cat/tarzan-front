/**
 * 料站表维护
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
import { routerRedux } from 'dva/router';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';

import FilterForm from './FilterForm';
import CreateDrawer from './CreateDrawer';
import ListTable from './ListTable';

@connect(({ materialStation, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  materialStation,
  loading: {
    fetchLoading: loading.effects['materialStation/queryList'],
    saveLoading: loading.effects['materialStation/createHeadData'],
    updateYLoading: loading.effects['materialStation/updateHeadY'],
    updateNLoading: loading.effects['materialStation/updateHeadN'],
  },
}))
@formatterCollections({
  code: ['hwms.materialStation', 'hwms.barcodeQuery', 'hwms.machineBasic'],
})
class MaterialStation extends Component {
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
      materialStation: { pagination },
    } = this.props;
    // 查询独立值集
    dispatch({
      type: 'materialStation/init',
      payload: {
        tenantId,
      },
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
      type: 'materialStation/queryList',
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
    dispatch({
      type: 'materialStation/createHeadData',
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
      materialStation: { pagination },
    } = this.props;
    dispatch({
      type: type === 'Y' ? 'materialStation/updateHeadY' : 'materialStation/updateHeadN',
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
      key: `/hwms/material-station/data-import/Z_MATERIAL_STATION`,
      title: intl.get('hwms.materialStation.view.message.import').d('料站表导入'),
      search: queryString.stringify({
        action: intl.get('hwms.materialStation.view.message.import').d('料站表导入'),
      }),
    });
  }

  /**
   * 跳转到明细界面
   * @param record
   */
  @Bind()
  handleDetail(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialStation/updateState',
      payload: {
        detailList: [],
        detailPagination: {},
      },
    });
    dispatch(
      routerRedux.push({
        pathname: `/hwms/material-station/detail`,
        params: {
          parentItem: record,
        },
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
      materialStation: { dataList = [], pagination = [], materialTypeMap = [], enableFlagMap = [] },
    } = this.props;
    const filterProps = {
      tenantId,
      materialTypeMap,
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
      onDetail: this.handleDetail,
    };
    const detailProps = {
      tenantId,
      showCreateDrawer,
      materialTypeMap,
      saveLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('hwms.materialStation.view.message.title').d('料站表维护')}>
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
          {showCreateDrawer && <CreateDrawer {...detailProps} />}
        </Content>
      </React.Fragment>
    );
  }
}

export default MaterialStation;
