/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description：cos 出站查询
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';

import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.cosOutboundQuery';

@connect(({ cosOutboundQuery, loading }) => ({
  cosOutboundQuery,
  fetchListLoading: loading.effects['cosOutboundQuery/queryDataList'],
}))
export default class CosOutboundQuery extends Component {

  constructor(props) {
    super(props);
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosOutboundQuery/batchLovData',
    });
    // 获取默认站点
    dispatch({
      type: 'cosOutboundQuery/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosOutboundQuery/updateState',
      payload: {
        headList: [],
        headPagination: {},
      },
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'cosOutboundQuery/queryDataList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { jobType, siteInDateFrom, siteInDateTo, siteOutDateFrom, siteOutDateTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            jobType: jobType ? jobType.toString() : null,
            siteInDateFrom: isEmpty(siteInDateFrom) ? null : moment(siteInDateFrom).format(DEFAULT_DATETIME_FORMAT),
            siteInDateTo: isEmpty(siteInDateTo) ? null : moment(siteInDateTo).format(DEFAULT_DATETIME_FORMAT),
            siteOutDateFrom: isEmpty(siteOutDateFrom) ? null : moment(siteOutDateFrom).format(DEFAULT_DATETIME_FORMAT),
            siteOutDateTo: isEmpty(siteOutDateTo) ? null : moment(siteOutDateTo).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      cosOutboundQuery: { headList = [], headPagination = {}, defaultSite = {}, jobMap = [], cosTypeMap = [] },
    } = this.props;
    const filterFormProps = {
      defaultSite,
      jobMap,
      cosTypeMap,
      tenantId,
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
    };
    const listTableProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS履历查询')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-cos-wip-query/cos-wip-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS履历查询.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <ListTable {...listTableProps} />
        </Content>
      </div>
    );
  }
}
