/*
 * @Description: 材料不良明细报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 17:40:06
 * @LastEditTime: 2021-02-03 10:02:34
 */
import React, { Fragment, useRef, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { isEmpty, isUndefined } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import TableList from './TableList';
import FilterForm from './FilterForm';

const MaterialNcReport = (props) => {
  const countRef = useRef();
  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'materialNcReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'materialNcReport/getSiteList',
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
      type: 'materialNcReport/handleFetchList',
      payload: {
        ...fieldsValue,
        materialCode: isUndefined(fieldsValue.materialCode)
          ? ''
          : fieldsValue.materialCode.length > 0
            ? fieldsValue.materialCode.toString()
            : '',
        assemblyCode: isUndefined(fieldsValue.assemblyCode)
          ? ''
          : fieldsValue.assemblyCode.length > 0
            ? fieldsValue.assemblyCode.toString()
            : '',
        workOrderNum: isUndefined(fieldsValue.workOrderNum)
          ? ''
          : fieldsValue.workOrderNum.length > 0
            ? fieldsValue.workOrderNum.toString()
            : '',
        materialLotCode: isUndefined(fieldsValue.materialLotCode)
          ? ''
          : fieldsValue.materialLotCode.length > 0
            ? fieldsValue.materialLotCode.toString()
            : '',
        attrValue: isUndefined(fieldsValue.attrValue)
          ? ''
          : fieldsValue.attrValue.length > 0
            ? fieldsValue.attrValue.toString()
            : '',
        ncIncidentStatus: isUndefined(fieldsValue.ncIncidentStatus)
          ? ''
          : fieldsValue.ncIncidentStatus.length > 0
            ? fieldsValue.ncIncidentStatus.toString()
            : '',
        processMethod: isUndefined(fieldsValue.processMethod)
          ? ''
          : fieldsValue.processMethod.length > 0
            ? fieldsValue.processMethod.toString()
            : '',
        dateTimeFrom: isUndefined(fieldsValue.dateTimeFrom)
          ? null
          : fieldsValue.dateTimeFrom
            ? moment(fieldsValue.dateTimeFrom).format(DEFAULT_DATETIME_FORMAT)
              : null,
        dateTimeTo: isUndefined(fieldsValue.dateTimeTo)
          ? null
          : fieldsValue.dateTimeTo
            ? moment(fieldsValue.dateTimeTo).format(DEFAULT_DATETIME_FORMAT)
            : null,
        closedDateTimeFrom: isUndefined(fieldsValue.closedDateTimeFrom)
          ? null
          : fieldsValue.closedDateTimeFrom
            ? moment(fieldsValue.closedDateTimeFrom).format(DEFAULT_DATETIME_FORMAT)
            : null,
        closedDateTimeTo: isUndefined(fieldsValue.closedDateTimeTo)
          ? null
          : fieldsValue.closedDateTimeTo
            ? moment(fieldsValue.closedDateTimeTo).format(DEFAULT_DATETIME_FORMAT)
            : null,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);


  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    return filterNullValueObject({
      ...fieldsValue,
      materialCode: isUndefined(fieldsValue.materialCode)
        ? ''
        : fieldsValue.materialCode.length > 0
          ? fieldsValue.materialCode.toString()
          : '',
      assemblyCode: isUndefined(fieldsValue.assemblyCode)
        ? ''
        : fieldsValue.assemblyCode.length > 0
          ? fieldsValue.assemblyCode.toString()
          : '',
      workOrderNum: isUndefined(fieldsValue.workOrderNum)
        ? ''
        : fieldsValue.workOrderNum.length > 0
          ? fieldsValue.workOrderNum.toString()
          : '',
      materialLotCode: isUndefined(fieldsValue.materialLotCode)
        ? ''
        : fieldsValue.materialLotCode.length > 0
          ? fieldsValue.materialLotCode.toString()
          : '',
      attrValue: isUndefined(fieldsValue.attrValue)
        ? ''
        : fieldsValue.attrValue.length > 0
          ? fieldsValue.attrValue.toString()
          : '',
      ncIncidentStatus: isUndefined(fieldsValue.ncIncidentStatus)
        ? ''
        : fieldsValue.ncIncidentStatus.length > 0
          ? fieldsValue.ncIncidentStatus.toString()
          : '',
      processMethod: isUndefined(fieldsValue.processMethod)
        ? ''
        : fieldsValue.processMethod.length > 0
          ? fieldsValue.processMethod.toString()
          : '',
      dateTimeFrom: isUndefined(fieldsValue.dateTimeFrom)
        ? null
        : fieldsValue.dateTimeFrom
          ? moment(fieldsValue.dateTimeFrom).format(DEFAULT_DATETIME_FORMAT)
          : null,
      dateTimeTo: isUndefined(fieldsValue.dateTimeTo)
        ? null
        : fieldsValue.dateTimeTo
          ? moment(fieldsValue.dateTimeTo).format(DEFAULT_DATETIME_FORMAT)
          : null,
      closedDateTimeFrom: isUndefined(fieldsValue.closedDateTimeFrom)
        ? null
        : fieldsValue.closedDateTimeFrom
          ? moment(fieldsValue.closedDateTimeFrom).format(DEFAULT_DATETIME_FORMAT)
          : null,
      closedDateTimeTo: isUndefined(fieldsValue.closedDateTimeTo)
        ? null
        : fieldsValue.closedDateTimeTo
          ? moment(fieldsValue.closedDateTimeTo).format(DEFAULT_DATETIME_FORMAT)
          : null,
    });
  };

  const {
    tenantId,
    materialNcReport: {
      ncIncidentStatus = [],
      ncProcessMethod = [],
      list = [],
      listPagination = {},
      defaultSite = {},
      siteList = [],
    },
    fetchLoading,
  } = props;
  const filterFormProps = {
    handleFetchList,
    ncIncidentStatus,
    ncProcessMethod,
    tenantId,
    defaultSite,
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
      <Header title="材料不良明细报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-material-bad-detailed/material-nc-export`} // 路径
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

export default connect(({ materialNcReport, loading }) => ({
  materialNcReport,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['materialNcReport/handleFetchList'],
}))(MaterialNcReport);
