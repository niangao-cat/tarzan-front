/*
 * @Description: IQC免检设置
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 10:06:59
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-07 13:58:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import CreateDrawer from './CreateDrawer';

@connect(({ iqcInspectionFree, loading }) => ({
  iqcInspectionFree,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['iqcInspectionFree/queryIQCfree'],
  saveLoading: loading.effects['iqcInspectionFree/createFreeData'],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      showCreateDrawer: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectionFree/getSiteList',
      payload: {},
    });
    dispatch({
      type: 'iqcInspectionFree/init',
    });
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'iqcInspectionFree/queryIQCfree',
      payload: {
        ...fields,
        ...fieldsValue,
      },
    }).then(res => {
      if (res) {
        this.setState({ selectedRowKeys: [], selectedRows: [] });
      }
    });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  // 打开抽屉
  @Bind()
  handleAddFreeData(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectionFree/updateState',
      payload: {
        detail: {
          exemptionFlag: 'Y',
          enableFlag: 'Y',
          ...record,
        },
      },
    });
    this.handleModalVisible(true);
  }

  /**
   *  是否显示条码新建modal
   */
  @Bind()
  handleModalVisible(flag) {
    this.setState({ showCreateDrawer: flag });
  }

  /**
   *  保存数据
   */
  @Bind()
  saveData(params) {
    const {
      dispatch,
      iqcInspectionFree: { detail = {} },
    } = this.props;
    dispatch({
      type: 'iqcInspectionFree/createFreeData',
      payload: {
        tenantId: getCurrentOrganizationId(),
        ...detail,
        ...params,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
        this.handleSearch();
      }
    });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 删除操作
  @Bind()
  deleteFreeData() {
    const { selectedRows } = this.state;
    const { dispatch } = this.props;
    if (selectedRows.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      dispatch({
        type: 'iqcInspectionFree/deleteFreeData',
        payload: {
          selectedRows,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { selectedRowKeys, showCreateDrawer } = this.state;
    const { fetchLoading, saveLoading, iqcInspectionFree, tenantId } = this.props;
    const {
      statusMap = [],
      enableMap = [],
      qualityStatusMap = [],
      performanceLevel = [],
      reasonMap = [],
      getSite = {},
      detail = {},
      iqcList = [],
      defaultSite = {},
      pagination = {},
      typeList = [],
    } = iqcInspectionFree;
    const filterProps = {
      tenantId,
      statusMap,
      enableMap,
      qualityStatusMap,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
      deleteFreeData: this.deleteFreeData,
    };
    const listProps = {
      selectedRowKeys,
      loading: fetchLoading,
      dataSource: iqcList,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
      handleAddFreeData: this.handleAddFreeData,
      pagination,
    };
    const detailProps = {
      detail,
      tenantId,
      showCreateDrawer,
      statusMap,
      qualityStatusMap,
      performanceLevel,
      reasonMap,
      saveLoading,
      getSite,
      typeList,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
      defaultSite,
    };
    return (
      <React.Fragment>
        <Header title="IQC免检设置">
          <Button type="primary" icon="plus" onClick={() => this.handleAddFreeData({})}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
          <CreateDrawer {...detailProps} />
        </Content>
      </React.Fragment>
    );
  }
}
