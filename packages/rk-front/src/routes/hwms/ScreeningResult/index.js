/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 导出结果
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import moment from 'moment';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import ExcelExport from '@/components/ExcelExport';
import intl from 'utils/intl';
import { Host } from '@/utils/config';
import { Header, Content } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';


const commonModelPrompt = 'tarzan.hwms.screeningResult';

@connect(({ screeningResult, loading }) => ({
  screeningResult,
  fetchListLoading: loading.effects['screeningResult/queryDataList'],
}))
export default class screeningResult extends Component {

  @Bind
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const values = this.handleGetFormValue();
    if (values) {
      dispatch({
        type: 'screeningResult/queryDataList',
        payload: {
          ...values,
          page,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, values) => {
        if (!err) {
          const { assemblyStartTime, assemblyEndTime } = values;
          queryParams = filterNullValueObject({
            ...values,
            assemblyStartTime: isEmpty(assemblyStartTime) ? null
              : moment(assemblyStartTime).format(DEFAULT_DATETIME_FORMAT),
            assemblyEndTime: isEmpty(assemblyEndTime) ? null
              : moment(values.assemblyEndTime).format(DEFAULT_DATETIME_FORMAT),
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      screeningResult: { headList = [], headPagination = {} },
    } = this.props;
    const filterFormProps = {
      onSearch: this.handleSearch,
      onRef: node => {
        this.formDom = node.props.form;
      },
    };
    const listTableProps = {
      pagination: headPagination,
      dataSource: headList,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('筛选结果')}>
          <ExcelExport
            exportAsync
            requestUrl={`${Host}/v1/${getCurrentOrganizationId()}/hme-selection-detailss/export-selection-details`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="筛选结果.xlsx"
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
