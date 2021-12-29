/**
 * cos工单损耗报表
 * @date: 2021/08/21 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isArray } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getCurrentUserId,
  getDateTimeFormat,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import { notification } from 'hzero-ui';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const dateTimeFormat = getDateTimeFormat();

@connect(({ cosWorkOrderLossReport, loading }) => ({
  cosWorkOrderLossReport,
  fetchListLoading: loading.effects['cosWorkOrderLossReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
 }))
@formatterCollections({
  code: 'tarzan.hhme.cosWorkOrderLossReport',
})
export default class WorkOrderLossReport extends Component {

  constructor(props) {
    super(props);
    this.init();
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosWorkOrderLossReport/init',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosWorkOrderLossReport/updateState',
      payload: {
        list: [],
        pagination: {},
      },
    });
  }

   /**
    * 查询盘点单列表
    *
    * @param {*} [page={}]
    * @memberof StockTakePlatform
    */
  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { prodLineIds, workOrderNums, assemblyMaterialIds, planStartTimeFrom, planStartTimeTo } = value;
    if(prodLineIds || workOrderNums || assemblyMaterialIds || planStartTimeFrom || planStartTimeTo) {
      value = {
        ...value,
        planStartTimeFrom: isEmpty(planStartTimeFrom)
          ? null
          : planStartTimeFrom.startOf('day').format(dateTimeFormat),
        planStartTimeTo: isEmpty(planStartTimeTo) ? null : planStartTimeTo.endOf('day').format(dateTimeFormat),
        workOrderNums: isArray(workOrderNums) ? workOrderNums.join(',') : null,
      };
      const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
      dispatch({
        type: 'cosWorkOrderLossReport/fetchList',
        payload: {
          page: isEmpty(page) ? {
            ...page,
            pageSize: 20,
          } : page,
          ...filterValue,
        },
      });
    } else {
      notification.warning({
        description: '产线、工单、产品编码，计划时间从，计划时间至查询条件必输其一',
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { workOrderNums, planStartTimeFrom, planStartTimeTo } = value;
    value = {
      ...value,
      planStartTimeFrom: isEmpty(planStartTimeFrom)
        ? null
        : planStartTimeFrom.startOf('day').format(dateTimeFormat),
      planStartTimeTo: isEmpty(planStartTimeTo) ? null : planStartTimeTo.endOf('day').format(dateTimeFormat),
      workOrderNums: isArray(workOrderNums) ? workOrderNums.join(',') : null,
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }

  @Bind()
  handleGetFormDisabled() {
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { prodLineIds, workOrderNums, assemblyMaterialIds, planStartTimeFrom, planStartTimeTo } = value;
    return !(prodLineIds || workOrderNums || assemblyMaterialIds || planStartTimeFrom || planStartTimeTo);
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      userId,
      cosWorkOrderLossReport: {
        list = [],
        pagination = {},
        statusList = [],
        siteInfo,
      },
    } = this.props;
    const filterProps = {
      tenantId,
      dataSource: list,
      statusList,
      siteInfo,
      userId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };
    const listProps = {
      loading: fetchListLoading,
      pagination,
      dataSource: list,
      onSearch: this.handleFetchList,
    };

    return (
      <React.Fragment>
        <Header title="cos工单损耗汇总报表">
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${tenantId}/hme-cos-attrition-sum/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listProps} />
          </div>
        </Content>
        <ModalContainer ref={registerContainer} />
      </React.Fragment>
    );
  }
}
