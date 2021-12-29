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
  getCurrentUserId,
  getDateTimeFormat,
} from 'utils/utils';
import ExcelExport from 'components/ExcelExport';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.materialDistributionReport';
const dateTimeFormat = getDateTimeFormat();

@connect(({ materialDistributionReport, loading }) => ({
  materialDistributionReport,
  fetchListLoading: loading.effects['materialDistributionReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.materialDistributionReport',
})
export default class MaterialDistributionReport extends Component {

  componentDidMount() {
    this.handleFetchList();
  }


  /**
   * 查询盘点单列表
   *
   * @param {*} [page={}]
   * @memberof MaterialDistributionReport
   */
  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { creationDateFrom, creationDateTo } = value;
    value = {
      ...value,
      creationDateFrom: isEmpty(creationDateFrom)
        ? null
        : creationDateFrom.startOf('day').format(dateTimeFormat),
      creationDateTo: isEmpty(creationDateTo) ? null : creationDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'materialDistributionReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleGetFormValue() {
    const filterValue = this.formDom === undefined ? {} : this.formDom.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      userId,
      materialDistributionReport: {
        list = [],
        pagination = {},
      },
    } = this.props;
    const filterProps = {
      tenantId,
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
        <Header title={intl.get(`${modelPrompt}.view.title`).d('物料配送空缺滚动报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-distribution-demands/export`}
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
