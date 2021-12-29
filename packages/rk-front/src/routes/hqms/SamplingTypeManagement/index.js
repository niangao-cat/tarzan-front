/*
 * @Description: 抽样类型管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 11:48:55
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:03:06
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import CreateDrawer from './CreateDrawer';

@connect(({ samplingTypeManagement, loading }) => ({
  samplingTypeManagement,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['samplingTypeManagement/fetchTypeManData'],
  saveDataLoading: loading.effects['samplingTypeManagement/saveData'],
}))
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'samplingTypeManagement/getTypeLov',
      payload: {
        sampleType: 'QMS.IQC_SAMPLE_TYPE', // 抽样类型
        standardType: 'QMS.IQC_SAMPLE_STANDARD_TYPE', // 抽样标准
        aql: 'QMS.IQC_AQL', // AQL
        inspectionLevels: 'QMS.IQC_INSPECTION_LEVELS', // 检验水平
      },
    });
    this.fetchTypeManData();
  }

  // 获取抽样类型管理数据
  @Bind()
  fetchTypeManData(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'samplingTypeManagement/fetchTypeManData',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 打开抽屉
  @Bind()
  handleAddData(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'samplingTypeManagement/updateState',
      payload: {
        detail: {
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
      samplingTypeManagement: { detail = {}, pagination = {} },
    } = this.props;
    dispatch({
      type: 'samplingTypeManagement/saveData',
      payload: {
        tenantId: getCurrentOrganizationId(),
        ...detail,
        ...params,
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible(false);
        notification.success();
        this.fetchTypeManData(pagination);
      }
    });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { fetchLoading, samplingTypeManagement, tenantId, saveDataLoading } = this.props;
    const { lovData = {}, typeManList = [], pagination = {}, detail = {} } = samplingTypeManagement;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.fetchTypeManData,
      lovData,
    };
    const listProps = {
      pagination,
      dataSource: typeManList,
      loading: fetchLoading,
      onSelectRow: this.handleSelectRow,
      onSearch: this.fetchTypeManData,
      handleUpdateData: this.handleAddData,
    };
    const detailProps = {
      tenantId,
      saveDataLoading,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
      lovData,
      showCreateDrawer: this.state.showCreateDrawer,
      detail,
    };
    return (
      <React.Fragment>
        <Header title="抽样类型管理">
          <Button type="primary" icon="plus" onClick={() => this.handleAddData({})}>
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
