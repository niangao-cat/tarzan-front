/*
 * @Description: 入库明细查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-04 10:26:58
 * @LastEditTime: 2021-03-04 19:19:25
 */

import React, { useRef, Fragment, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import TableList from './TableList';


const WarehousingDetailReport = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'warehousingDetailReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'warehousingDetailReport/getSiteList',
      payload: {
        tenantId,
      },
    });
  }, []);

  const handleFetchList = useCallback((fields = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = countRef.current.formFields;
    // console.log('fieldsValue=', fieldsValue);
    dispatch({
      type: 'warehousingDetailReport/handleFetchList',
      payload: {
        ...fieldsValue,
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : fieldsValue.creationDateFrom === null
            ? ''
            : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateFromTo: isUndefined(fieldsValue.creationDateFromTo)
          ? null
          : fieldsValue.creationDateFromTo === null
            ? ''
            : moment(fieldsValue.creationDateFromTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 导出
  const handleGetFormValue = () => {
    const fieldsValue = countRef.current && countRef.current.formFields;
    // console.log('countRef.current==', countRef.current && countRef.current);
    return filterNullValueObject({
      ...fieldsValue,
      creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
        ? null
        : fieldsValue.creationDateFrom === null
          ? ''
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateFromTo: isUndefined(fieldsValue.creationDateFromTo)
        ? null
        : fieldsValue.creationDateFromTo === null
          ? ''
          : moment(fieldsValue.creationDateFromTo).format(DEFAULT_DATETIME_FORMAT),
    });
  };

  const {
    warehousingDetailReport: {
      areaName = [],
      woType = [],
      woStatus = [],
      docStatus = [],
      defaultSite = {},
      list = [],
      pagination = {},
    },
    tenantId,
    handleFetchListLoading,
  } = props;
  const filterFormProps = {
    areaName,
    woType,
    woStatus,
    docStatus,
    defaultSite,
    tenantId,
    handleFetchList,
  };
  const tableListProps = {
    dataSource: list,
    pagination,
    loading: handleFetchListLoading,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="入库明细查询报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-stock-in-details/list-export`} // 路径
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue}
        />
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <TableList {...tableListProps} />
      </Content>
    </Fragment>
  );
};

export default connect(({ warehousingDetailReport, loading }) => ({
  warehousingDetailReport,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['warehousingDetailReport/handleFetchList'],
}))(WarehousingDetailReport);
