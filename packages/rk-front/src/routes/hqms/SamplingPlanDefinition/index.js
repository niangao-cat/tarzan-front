/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-30 14:06:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-06 17:02:20
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

@connect(({ samplingPlanDefinition, loading }) => ({
  samplingPlanDefinition,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['samplingPlanDefinition/handleSearch'],
  saveDataLoading: loading.effects['samplingPlanDefinition/savePlanDef'],
}))
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showCreateDrawer: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'samplingPlanDefinition/getTypeLov',
      payload: {
        planType: 'QMS.IQC_SAMPLE_PLAN_TYPE', // 计划类型
        stanardType: 'QMS.IQC_SAMPLE_STANDARD_TYPE', // 标准类型
        codeType: 'QMS.IQC_SAMPLE_SIZE_CODE_LEVEL', // 字码
        aql: 'QMS.IQC_AQL', // aql
      },
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
      type: 'samplingPlanDefinition/handleSearch',
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
      type: 'samplingPlanDefinition/updateState',
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
  saveData(param) {
    const {
      dispatch,
      samplingPlanDefinition: { detail = {} },
    } = this.props;
    const params = filterNullValueObject(param);
    if (params.lotUpperLimit > param.lotLowerLimit) {
      notification.error({ message: '批量上限不大于批量下限' });
    } else {
      dispatch({
        type: 'samplingPlanDefinition/savePlanDef',
        payload: {
          tenantId: getCurrentOrganizationId(),
          ...detail,
          ...params,
          attribute1: isEmpty(params.attribute1)? "": params.attribute1,
        },
      }).then(res => {
        if (res) {
          this.handleModalVisible(false);
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const { showCreateDrawer } = this.state;
    const { fetchLoading, samplingPlanDefinition, tenantId, saveDataLoading } = this.props;
    const { detail = {}, pagination = {}, lovData = {}, planDefList = [] } = samplingPlanDefinition;
    const filterProps = {
      tenantId,
      onRef: this.handleBindRef,
      onSearch: this.handleSearch,
      lovData,
    };
    const listProps = {
      loading: fetchLoading,
      dataSource: planDefList,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
      handleAddData: this.handleAddData,
      pagination,
    };
    const detailProps = {
      detail,
      tenantId,
      showCreateDrawer,
      onCancel: this.handleModalVisible,
      onOk: this.saveData,
      lovData,
      saveDataLoading,
    };
    return (
      <React.Fragment>
        <Header title="抽样方案定义">
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
