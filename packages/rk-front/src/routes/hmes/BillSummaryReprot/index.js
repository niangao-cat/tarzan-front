/*
 * @Description: 单据汇总查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:56:30
 * @LastEditTime: 2021-02-26 12:25:04
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

const BillSummaryReprot = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'billSummaryReprot/batchLovData',
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
    dispatch({
      type: 'billSummaryReprot/handleFetchList',
      payload: {
        ...fieldsValue,
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : fieldsValue.creationDateFrom === null
            ? null
            : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateFromTo: isUndefined(fieldsValue.creationDateFromTo)
          ? null
          : fieldsValue.creationDateFromTo === null
            ? null
            : moment(fieldsValue.creationDateFromTo).format(DEFAULT_DATETIME_FORMAT),
        lastUpdateDateFrom: isUndefined(fieldsValue.lastUpdateDateFrom)
          ? null
          : fieldsValue.lastUpdateDateFrom === null
            ? null
            : moment(fieldsValue.lastUpdateDateFrom).format(DEFAULT_DATETIME_FORMAT),
        lastUpdateDateTo: isUndefined(fieldsValue.lastUpdateDateTo)
          ? null
          : fieldsValue.lastUpdateDateTo === null
            ? null
            : moment(fieldsValue.lastUpdateDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 导出
  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    return filterNullValueObject({
      ...fieldsValue,
      creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
        ? null
        : fieldsValue.creationDateFrom === null
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
      creationDateFromTo: isUndefined(fieldsValue.creationDateFromTo)
        ? null
        : fieldsValue.creationDateFromTo === null
          ? null
          : moment(fieldsValue.creationDateFromTo).format(DEFAULT_DATETIME_FORMAT),
      lastUpdateDateFrom: isUndefined(fieldsValue.lastUpdateDateFrom)
        ? null
        : fieldsValue.lastUpdateDateFrom === null
          ? null
          : moment(fieldsValue.lastUpdateDateFrom).format(DEFAULT_DATETIME_FORMAT),
      lastUpdateDateTo: isUndefined(fieldsValue.lastUpdateDateTo)
        ? null
        : fieldsValue.lastUpdateDateTo === null
          ? null
          : moment(fieldsValue.lastUpdateDateTo).format(DEFAULT_DATETIME_FORMAT),
    });
  };

  const {
    billSummaryReprot: {
      docType = [],
      docStatus = [],
      list = [],
      pagination = {},
    },
    tenantId,
    handleFetchListLoading,
  } = props;
  const filterFormProps = {
    docType,
    docStatus,
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
      <Header title="单据汇总查询报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/doc-summary/report-export`} // 路径
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue()}
        />
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <TableList {...tableListProps} />
      </Content>
    </Fragment>
  );
};

export default connect(({ billSummaryReprot, loading }) => ({
  billSummaryReprot,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['billSummaryReprot/handleFetchList'],
}))(BillSummaryReprot);
