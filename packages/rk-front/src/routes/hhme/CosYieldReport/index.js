/**
 * CosTestYield - COS测试良率维护
 * *
 * @date: 2021/09/06 14:44:42
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty, isArray } from 'lodash';

import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
} from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const CosYieldReport = (props) => {
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'cosYieldReport/init',
    });
  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = handleGetFormValue();
    dispatch({
      type: 'cosYieldReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleGetFormValue = () => {
    const filterValue = isUndefined(filterRef.current) ? {} : filterRef.current.formFields;
    const { waferNums, monitorDocNums, cosTypes } = filterValue;
    return filterNullValueObject({
      ...filterValue,
      waferNums: isArray(waferNums) ? waferNums.toString() : null,
      monitorDocNums: isArray(monitorDocNums) ? monitorDocNums.toString() : null,
      cosTypes: isArray(cosTypes) ? cosTypes.toString() : null,
    });
  };

  const {
    fetchListLoading,
    tenantId,
    cosYieldReport: {
      list = [],
      pagination = {},
      cosTypeList = [],
      siteInfo = {},
    },
  } = props;
  const filterProps = {
    tenantId,
    cosTypeList,
    siteInfo,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    tenantId,
    dataSource: list,
    pagination,
    loading: fetchListLoading,
    onSearch: handleSearch,
  };

  return (
    <React.Fragment>
      <Header title="COS良率监控报表">
        <ExcelExport
          exportAsync
          requestUrl={`${ReportHost}/v1/${tenantId}/hme-cos-test-monitor/export`} // 路径
          exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-cos-test-monitor/async-export`}
          createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-cos-test-monitor/create-task`}
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue}
          fileName="COS良率监控报表.xlsx"
        />
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <ListTable {...listTableProps} />
        </div>
      </Content>
    </React.Fragment>
  );
};

export default connect(({ cosYieldReport, loading }) => ({
  cosYieldReport,
  fetchListLoading: loading.effects['cosYieldReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))(CosYieldReport);
