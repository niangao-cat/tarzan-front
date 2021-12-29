/*
 * @Description: 物料周转报表
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

const MaterialturnoverReport = (props) => {
  const countRef = useRef();
  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'materialturnoverReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'materialturnoverReport/getSiteList',
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
      type: 'materialturnoverReport/handleFetchList',
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
    materialturnoverReport: {
      list = [],
      listPagination = {},
      siteMap = [],
      siteList = [],
    },
    fetchLoading,
  } = props;
  const filterFormProps = {
    handleFetchList,
    tenantId,
    siteMap,
    siteList,
  };
  const tableListProps = {
    dataSource: list,
    pagination: listPagination,
    loading: fetchLoading,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="物料周转率报表">
        <ExcelExport
          exportAsync
          requestUrl={`${Host}/v1/${getCurrentOrganizationId()}/wms-material-turnover-rate/export`} // 路径
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

export default connect(({ materialturnoverReport, loading }) => ({
  materialturnoverReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['materialturnoverReport/handleFetchList'],
}))(MaterialturnoverReport);
