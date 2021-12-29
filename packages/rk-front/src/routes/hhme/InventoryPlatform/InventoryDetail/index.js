/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty } from 'lodash';

import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from '../index.less';


@connect(({ inventoryPlatform, loading }) => ({
  inventoryPlatform,
  fetchInventoryDetailLoading: loading.effects['inventoryPlatform/fetchInventoryDetail'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.inventoryPlatform',
})
export default class InventoryPlatform extends Component {
  constructor(props) {
    super(props);
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        detailList: [],
        detailPagination: {},
      },
    });
  }

  componentDidMount() {
    this.handleSearch();
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch, match: { params: { stocktakeIds }} } = this.props;
    const stocktakeIdList = stocktakeIds.split('-');
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'inventoryPlatform/fetchInventoryDetail',
      payload: {
        page: isEmpty(page) ? {} : page,
        stocktakeIdList,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const { match: { params: { stocktakeIds }} } = this.props;
    const stocktakeIdList = stocktakeIds.split('-');
    const filterValue = this.formDom === undefined ? {} : this.formDom.getFieldsValue();
    return filterNullValueObject({ stocktakeIdList, ...filterValue });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchInventoryDetailLoading,
      tenantId,
      inventoryPlatform: {
        detailList = [],
        detailPagination = {},
      },
    } = this.props;
    const filterProps = {
      tenantId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listTableProps = {
      tenantId,
      loading: fetchInventoryDetailLoading,
      pagination: detailPagination,
      dataSource: detailList,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title="在制品盘点明细" backPath="/hhme/inventory-platform/list">
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-wip-stocktake-docs/detail/export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listTableProps} />
          </div>
        </Content>
      </div>
    );
  }
}
