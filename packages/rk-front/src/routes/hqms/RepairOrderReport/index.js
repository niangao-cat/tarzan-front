/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
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
import { ReportHost } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
 import styles from './index.less';

const dateTimeFormat = getDateTimeFormat();

@connect(({ repairOrderReport, loading }) => ({
repairOrderReport,
  fetchListLoading: loading.effects['repairOrderReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.stockTakePlatform',
})
export default class RepairOrderReport extends Component {

  constructor(props) {
    super(props);
    this.init();
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderReport/fetchDefaultSite',
    });
    dispatch({
      type: 'repairOrderReport/fetchSiteList',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairOrderReport/updateState',
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
    const value = this.handleGetFormValue();
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'repairOrderReport/fetchList',
      payload: {
        page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { sapCreationDateStart, sapCreationDateEnd, sapReturnDateStart, sapReturnDateEnd, receiveDateStart, receiveDateEnd, snNumList, materialCodeList } = value;
    value = {
      ...value,
      sapCreationDateStart: isEmpty(sapCreationDateStart) ? null : sapCreationDateStart.format(dateTimeFormat),
      sapCreationDateEnd: isEmpty(sapCreationDateEnd) ? null : sapCreationDateEnd.format(dateTimeFormat),
      sapReturnDateStart: isEmpty(sapReturnDateStart) ? null : sapReturnDateStart.format(dateTimeFormat),
      sapReturnDateEnd: isEmpty(sapReturnDateEnd) ? null : sapReturnDateEnd.format(dateTimeFormat),
      receiveDateStart: isEmpty(receiveDateStart) ? null : receiveDateStart.format(dateTimeFormat),
      receiveDateEnd: isEmpty(receiveDateEnd) ? null : receiveDateEnd.format(dateTimeFormat),
      snNum: isArray(snNumList) ? snNumList.join(',') : null,
      materialCode: isArray(materialCodeList) ? materialCodeList.join(',') : null,
    };
    return filterNullValueObject(value);
  }

  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      repairOrderReport: {
        list = [],
        pagination = {},
        siteList = [],
        defaultSite,
      },
    } = this.props;
    const filterProps = {
      defaultSite,
      siteList,
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
        <Header title="维修订单查看报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/repair-order/export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listProps} />
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
