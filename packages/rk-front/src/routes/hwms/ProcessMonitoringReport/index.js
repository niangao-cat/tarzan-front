/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form } from 'hzero-ui';
import moment from 'moment';
import { isArray, isEmpty } from 'lodash';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import FilterForm from './FilterForm';
import ListTable from './ListTable';

const commonModelPrompt = 'tarzan.hwms.processMonitoringReport';

@connect(({ processMonitoringReport, loading }) => ({
  processMonitoringReport,
  fetchListLoading: loading.effects['processMonitoringReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class ProcessMonitoringReport extends Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'processMonitoringReport/init',
    });
    dispatch({
      type: 'processMonitoringReport/fetchDefaultSite',
    }).then(res => {
      if(res) {
        dispatch({
          type: 'processMonitoringReport/fetchDepartmentList',
          payload: {
            siteId: res.siteId,
            areaCategory: 'SYB',
          },
        });
      }
    });
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'processMonitoringReport/fetchList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    const { processMonitoringReport: { siteInfo } } = this.props;
    if(this.formDom) {
      this.formDom.validateFields((err, value) => {
        if(!err) {
          const {
            planStartTimeFrom,
            planStartTimeTo,
            planCompleteTimeFrom,
            planCompleteTimeTo,
            actualCompleteTimeFrom,
            actualCompleteTimeTo,
            erpCreateTimeFrom,
            erpCreateTimeTo,
            erpRealseTimeFrom,
            erpRealseTimeTo,
            workoderStatus,
          } = value;
          queryParams = filterNullValueObject({
            ...value,
            siteId: siteInfo.siteId,
            planStartTimeFrom: isEmpty(planStartTimeFrom) ? null: moment(planStartTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            planStartTimeTo: isEmpty(planStartTimeTo) ? null : moment(planStartTimeTo).format(DEFAULT_DATETIME_FORMAT),
            planCompleteTimeFrom: isEmpty(planCompleteTimeFrom) ? null: moment(planCompleteTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            planCompleteTimeTo: isEmpty(planCompleteTimeTo) ? null : moment(planCompleteTimeTo).format(DEFAULT_DATETIME_FORMAT),
            actualCompleteTimeFrom: isEmpty(actualCompleteTimeFrom) ? null: moment(actualCompleteTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            actualCompleteTimeTo: isEmpty(actualCompleteTimeTo) ? null : moment(actualCompleteTimeTo).format(DEFAULT_DATETIME_FORMAT),
            erpCreateTimeFrom: isEmpty(erpCreateTimeFrom) ? null: moment(erpCreateTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            erpCreateTimeTo: isEmpty(erpCreateTimeTo) ? null : moment(erpCreateTimeTo).format(DEFAULT_DATETIME_FORMAT),
            erpRealseTimeFrom: isEmpty(erpRealseTimeFrom) ? null: moment(erpRealseTimeFrom).format(DEFAULT_DATETIME_FORMAT),
            erpRealseTimeTo: isEmpty(erpRealseTimeTo) ? null : moment(erpRealseTimeTo).format(DEFAULT_DATETIME_FORMAT),
            workoderStatus: isArray(workoderStatus) ? workoderStatus.join(',') : null,
          });
        }
      });
    }
    return queryParams;
  }

  render() {
    const {
      fetchListLoading,
      tenantId,
      processMonitoringReport: {
        list = [],
        pagination = {},
        typeMap = [],
        statusMap = [],
        siteInfo = {},
        departmentList = [],
      },
    } = this.props;
    const filterFormProps = {
      tenantId,
      typeMap,
      statusMap,
      siteInfo,
      departmentList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listTableProps = {
      dataSource: list,
      pagination,
      loading: fetchListLoading,
      onSearch: this.handleSearch,
    };
    return (
      <div>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('生产执行全过程监控报表')}>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/production-execution-whole-process-monitoring-report/list-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="生产执行全过程监控报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <ListTable {...listTableProps} />
        </Content>
        <ModalContainer ref={registerContainer} />
      </div>
    );
  }
}
