/*
 * @Description: 七日出入库动态报表
 */
import React, { Fragment, useRef, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { Host } from '@/utils/config';
import { isEmpty, isUndefined } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
// import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import TableList from './TableList';
import FilterForm from './FilterForm';

const ReceiptDynamicReport = (props) => {
  const countRef = useRef();
  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'receiptDynamicReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'receiptDynamicReport/getSiteList',
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
      type: 'receiptDynamicReport/handleFetchList',
      payload: {
        ...fieldsValue,
        startDate: isUndefined(fieldsValue.startDate)
          ? null
          : fieldsValue.startDate
            ? moment(fieldsValue.startDate).format('YYYY-MM-DD 00:00:00')
            : null,
        endDate: isUndefined(fieldsValue.endDate)
          ? null
          : fieldsValue.endDate
            ? moment(fieldsValue.endDate).format('YYYY-MM-DD 23:59:59')
            : null,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);


  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    return filterNullValueObject({
      ...fieldsValue,
      startDate: isUndefined(fieldsValue.startDate)
        ? null
        : fieldsValue.startDate
          ? moment(fieldsValue.startDate).format('YYYY-MM-DD 0:00:00')
          : null,
      endDate: isUndefined(fieldsValue.endDate)
        ? null
        : fieldsValue.endDate
          ? moment(fieldsValue.endDate).format('YYYY-MM-DD 23:59:59')
          : null,
    });
  };

  const {
    tenantId,
    receiptDynamicReport: {
      list = [],
      listPagination = {},
      siteMap = [],
      siteList = [],
      stockTypeList = [],
    },
    fetchLoading,
  } = props;
  const filterFormProps = {
    handleFetchList,
    tenantId,
    siteMap,
    siteList,
    stockTypeList,
  };
  const tableListProps = {
    dataSource: list,
    pagination: listPagination,
    loading: fetchLoading,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="七日出入库动态报表">
        <ExcelExport
          exportAsync
          requestUrl={`${Host}/v1/${getCurrentOrganizationId()}/wms-stock-dynamic-report/export`} // 路径
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

export default connect(({ receiptDynamicReport, loading }) => ({
  receiptDynamicReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['receiptDynamicReport/handleFetchList'],
}))(ReceiptDynamicReport);
