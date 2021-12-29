/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS员工产量汇总报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';

import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import TableList from './TableList';
import FilterForm from './FilterForm';

const commonModelPrompt = 'tarzan.hwms.cosEmployeeOutputSummaryReport';

@connect(({ cosEmployeeOutputSummaryReport, loading }) => ({
  cosEmployeeOutputSummaryReport,
  fetchListLoading: loading.effects['cosEmployeeOutputSummaryReport/queryDataList'],
}))
export default class cosEmployeeOutputSummaryReport extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cosEmployeeOutputSummaryReport/batchLovData',
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'cosEmployeeOutputSummaryReport/queryDataList',
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
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const { cosType, createDateFrom, createDateTo } = value;
          queryParams = filterNullValueObject({
            ...value,
            cosType: cosType && cosType.toString(),
            createDateFrom: isEmpty(createDateFrom) ? null
              : moment(createDateFrom).format(DEFAULT_DATETIME_FORMAT),
            createDateTo: isEmpty(createDateTo) ? null
              : moment(createDateTo).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      cosEmployeeOutputSummaryReport: {
        headList = [],
        headPagination = {},
        cosTypeMap = [],
      },
    } = this.props;
    const filterFormProps = {
      cosTypeMap,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listProps = {
      dataSource: headList,
      pagination: headPagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('COS员工产量汇总报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-cos-staff-product/staff-product-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="COS员工产量汇总报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <TableList {...listProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </div>
    );
  }
}
