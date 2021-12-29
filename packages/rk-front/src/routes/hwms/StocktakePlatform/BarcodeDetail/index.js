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
import { isUndefined, isEmpty } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from '../index.less';

const modelPrompt = 'tarzan.hmes.stockTakePlatform';

@connect(({ stockTakePlatform, loading }) => ({
  stockTakePlatform,
  fetchBarcodeListLoading: loading.effects['stockTakePlatform/fetchBarcodeList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.stockTakePlatform',
})
export default class BarcodeDetail extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockTakePlatform/barCodeInit',
    });
    this.handleFetchList();
  }


  /**
   * 查询盘点单列表
   *
   * @param {*} [page={}]
   * @memberof StockTakePlatform
   */
  @Bind()
  handleFetchList(page = {}) {
    const { dispatch, match: { params: { stocktakeIds }} } = this.props;
    const stocktakeIdList = stocktakeIds.split('-').join(',');
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'stockTakePlatform/fetchBarcodeList',
      payload: {
        page: isEmpty(page) ? {} : page,
        stocktakeIds: stocktakeIdList,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return { ...filterValue };
  }


  // 渲染 界面布局
  render() {
    const {
      fetchBarcodeListLoading,
      tenantId,
      stockTakePlatform: {
        barcodeList = [],
        barcodePagination = {},
        barcodeStatusList = [],
        siteInfo,
      },
      match: { params: { stocktakeIds } },
    } = this.props;
    const stocktakeIdList = stocktakeIds.split('-').join(',');
    const filterProps = {
      tenantId,
      barcodeStatusList,
      siteInfo,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
      areaLocatorId: this.props.location.query && this.props.location.query.areaLocatorId,
    };
    const listProps = {
      loading: fetchBarcodeListLoading,
      pagination: barcodePagination,
      dataSource: barcodeList,
      onSearch: this.handleFetchList,
    };

    return (
      <React.Fragment>
        <Header
          title={intl.get(`${modelPrompt}.view.title`).d('条码明细')}
          backPath='/hwms/stock-take-platform/list'
        >
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/wms-stocktake-actual/export?stocktakeIds=${stocktakeIdList}`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={{ ...this.handleGetFormValue(), stocktakeIds: stocktakeIdList }} // 查询条件
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
