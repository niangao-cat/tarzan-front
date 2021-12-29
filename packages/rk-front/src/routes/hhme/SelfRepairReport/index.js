/*
 * @Description: 自制件返修统计报表
 * @Version: 0.0.1
 * @Author: xin.t@raycuslaser.com
 * @Date: 2021-07-6
 */

import React, { useRef, Fragment, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { isArray, isEmpty } from 'lodash';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import FilterForm from './FilterForm';
import TableList from './ListTable';

const dateTimeFormat = getDateTimeFormat();


const SelfRepairReport = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'selfRepairReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'selfRepairReport/fetchLovWorkShop',
      payload: {
        lovCode: 'HME.SITE_WORK_SHOP',
        params: {
          tenantId,
        },
      },
    });
    dispatch({
      type: 'selfRepairReport/fetchWarehouseTypeList',
      payload: {
        module: 'MODELING',
        typeGroup: 'LOCATOR_TYPE',
      },
    });
  }, []);

  // 查询
  const handleFetchList = useCallback((fields = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = handleGetFormValue();
    dispatch({
      type: 'selfRepairReport/handleFetchList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 导出
  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    const { actualStartDateFrom, actualStartDateTo, actualEndDateFrom, actualEndDateTo, repairSnNum, materialCode, workOrderStatus, materialLotCodeStatus, ...otherValue } = fieldsValue;
    return filterNullValueObject({
      ...otherValue,
      actualStartDateFrom: isEmpty(actualStartDateFrom)
        ? null : actualStartDateFrom.format(dateTimeFormat),
        actualStartDateTo: isEmpty(actualStartDateTo)
        ? null : actualStartDateTo.format(dateTimeFormat),
      actualEndDateFrom: isEmpty(actualEndDateFrom)
        ? null : actualEndDateFrom.format(dateTimeFormat),
      actualEndDateTo: isEmpty(actualEndDateTo)
        ? null : actualEndDateTo.format(dateTimeFormat),
      repairSnNum: isArray(repairSnNum) ? repairSnNum.join(',') : null,
      materialCode: isArray(materialCode) ? materialCode.join(',') : null,
      workOrderStatus: isArray(workOrderStatus) ? workOrderStatus.join(',') : null,
      materialLotCodeStatus: isArray(materialLotCodeStatus) ? materialLotCodeStatus.join(',') : null,
    });
  };

  const {
    selfRepairReport: {
      docStatus = [],
      list = [],
      pagination = {},
      siteInfo = {},
      siteList = [],
      workShopList = [],
      warehouseTypeList = [],
      wordOrderStatusList = [],
      materialLotCodeStatusList = [],
      flagList = [],
    },
    tenantId,
    handleFetchListLoading,
  } = props;
  const filterFormProps = {
    docStatus,
    tenantId,
    handleFetchList,
    siteList,
    siteInfo,
    workShopList,
    warehouseTypeList,
    wordOrderStatusList,
    materialLotCodeStatusList,
    flagList,
  };
  const tableListProps = {
    dataSource: list,
    materialLotCodeStatusList,
    pagination,
    loading: handleFetchListLoading,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="自制件返修统计报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-self-repair/export`}
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

export default connect(({ selfRepairReport, loading }) => ({
  selfRepairReport,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['selfRepairReport/handleFetchList'],
}))(SelfRepairReport);
