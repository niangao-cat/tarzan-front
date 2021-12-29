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
import { isEmpty, isArray, isUndefined } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const dateTimeFormat = getDateTimeFormat();

@connect(({ processCollectionResultReport, loading }) => ({
processCollectionResultReport,
  fetchListLoading: loading.effects['processCollectionResultReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.processCollectionResultReport',
})
export default class ProcessCollectionResultReport extends Component {

  constructor(props) {
    super(props);
    this.init();
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionResultReport/init',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processCollectionResultReport/updateState',
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
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        const { workOrderNumList, snList, materialCodeList, tagGroupCodeList, tagCodeList, processCodeList, workcellCodeList, gatherDateFrom, gatherDateTo, siteInDateFrom, siteInDateTo, siteOutDateFrom, siteOutDateTo } = value;
        const newValue = {
          ...value,
          gatherDateFrom: isEmpty(gatherDateFrom) ? null : gatherDateFrom.format(dateTimeFormat),
          gatherDateTo: isEmpty(gatherDateTo) ? null : gatherDateTo.format(dateTimeFormat),
          siteInDateFrom: isEmpty(siteInDateFrom) ? null : siteInDateFrom.format(dateTimeFormat),
          siteInDateTo: isEmpty(siteInDateTo) ? null : siteInDateTo.format(dateTimeFormat),
          siteOutDateFrom: isEmpty(siteOutDateFrom) ? null : siteOutDateFrom.format(dateTimeFormat),
          siteOutDateTo: isEmpty(siteOutDateTo) ? null : siteOutDateTo.format(dateTimeFormat),
          workOrderNumList: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
          snList: isArray(snList) ? snList.join(',') : null,
          materialCodeList: isArray(materialCodeList) ? materialCodeList.join(',') : null,
          tagGroupCodeList: isArray(tagGroupCodeList) ? tagGroupCodeList.join(',') : null,
          tagCodeList: isArray(tagCodeList) ? tagCodeList.join(',') : null,
          processCodeList: isArray(processCodeList) ? processCodeList.join(',') : null,
          workcellCodeList: isArray(workcellCodeList) ? workcellCodeList.join(',') : null,
        };
        const filterValue = filterNullValueObject(newValue);
        dispatch({
          type: 'processCollectionResultReport/fetchList',
          payload: {
            page,
            ...filterValue,
          },
        });
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { workOrderNumList, snList, materialCodeList, tagGroupCodeList, tagCodeList, processCodeList, workcellCodeList, gatherDateFrom, gatherDateTo, siteInDateFrom, siteInDateTo, siteOutDateFrom, siteOutDateTo } = value;
    value = {
      ...value,
      gatherDateFrom: isEmpty(gatherDateFrom) ? null : gatherDateFrom.format(dateTimeFormat),
      gatherDateTo: isEmpty(gatherDateTo) ? null : gatherDateTo.format(dateTimeFormat),
      siteInDateFrom: isEmpty(siteInDateFrom) ? null : siteInDateFrom.format(dateTimeFormat),
      siteInDateTo: isEmpty(siteInDateTo) ? null : siteInDateTo.format(dateTimeFormat),
      siteOutDateFrom: isEmpty(siteOutDateFrom) ? null : siteOutDateFrom.format(dateTimeFormat),
      siteOutDateTo: isEmpty(siteOutDateTo) ? null : siteOutDateTo.format(dateTimeFormat),
      workOrderNumList: isArray(workOrderNumList) ? workOrderNumList.join(',') : null,
      snList: isArray(snList) ? snList.join(',') : null,
      materialCodeList: isArray(materialCodeList) ? materialCodeList.join(',') : null,
      tagGroupCodeList: isArray(tagGroupCodeList) ? tagGroupCodeList.join(',') : null,
      tagCodeList: isArray(tagCodeList) ? tagCodeList.join(',') : null,
      processCodeList: isArray(processCodeList) ? processCodeList.join(',') : null,
      workcellCodeList: isArray(workcellCodeList) ? workcellCodeList.join(',') : null,
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return filterValue;
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      processCollectionResultReport: {
        list = [],
        pagination = {},
        siteInfo = {},
        siteList = [],
      },
    } = this.props;
    const filterProps = {
      tenantId,
      siteList,
      siteInfo,
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
        <Header title="工序采集结果报表">
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/hme-report/mes-report/process-gather-result/export`} // 路径
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
