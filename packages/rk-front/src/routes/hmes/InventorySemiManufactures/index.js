/*
 * @Description: 售后在制品盘点半成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */

import React, { useRef, Fragment, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import FilterForm from './FilterForm';
import TableList from './TableList';


const InventorySemiManufactures = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'inventorySemiManufactures/batchLovData',
      payload: {
        tenantId,
      },
    });
  }, []);

  // 查询
  const handleFetchList = useCallback((fields = {}) => {
    const {
      dispatch,
    } = props;
    const fieldsValue = countRef.current.formFields;
    dispatch({
      type: 'inventorySemiManufactures/handleFetchList',
      payload: {
        ...fieldsValue,
        splitStatus: fieldsValue.splitStatus && fieldsValue.splitStatus.toString(),
        materialtLotStatus: fieldsValue.materialtLotStatus && fieldsValue.materialtLotStatus.toString(),
        workOrderStatus: fieldsValue.workOrderStatus && fieldsValue.workOrderStatus.toString(),
        snNum: fieldsValue.snNum && fieldsValue.snNum.toString(),
        materialLotCode: fieldsValue.materialLotCode && fieldsValue.materialLotCode.toString(),
        materialCode: fieldsValue.materialCode && fieldsValue.materialCode.toString(),
        warehouseCode: fieldsValue.warehouseCode && fieldsValue.warehouseCode.toString(),
        workcellCode: fieldsValue.workcellCode && fieldsValue.workcellCode.toString(),
        splitDateFrom: fieldsValue.splitDateFrom
          ? moment(fieldsValue.splitDateFrom).format(DEFAULT_DATETIME_FORMAT)
          : "",
        splitDateTo: fieldsValue.splitDateTo
          ? moment(fieldsValue.splitDateTo).format(DEFAULT_DATETIME_FORMAT)
          : "",
        workOrderDateFrom: fieldsValue.workOrderDateFrom
          ? moment(fieldsValue.workOrderDateFrom).format(DEFAULT_DATETIME_FORMAT)
          : "",
        workOrderDateTo: fieldsValue.workOrderDateTo
          ? moment(fieldsValue.workOrderDateTo).format(DEFAULT_DATETIME_FORMAT)
          : "",
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 导出
  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    return filterNullValueObject({
      ...fieldsValue,
      splitStatus: fieldsValue.splitStatus && fieldsValue.splitStatus.toString(),
      materialtLotStatus: fieldsValue.materialtLotStatus && fieldsValue.materialtLotStatus.toString(),
      workOrderStatus: fieldsValue.workOrderStatus && fieldsValue.workOrderStatus.toString(),
      snNum: fieldsValue.snNum && fieldsValue.snNum.toString(),
      materialLotCode: fieldsValue.materialLotCode && fieldsValue.materialLotCode.toString(),
      materialCode: fieldsValue.materialCode && fieldsValue.materialCode.toString(),
      warehouseCode: fieldsValue.warehouseCode && fieldsValue.warehouseCode.toString(),
      workcellCode: fieldsValue.workcellCode && fieldsValue.workcellCode.toString(),
      splitDateFrom: fieldsValue.splitDateFrom && fieldsValue.splitDateFrom
        ? moment(fieldsValue.splitDateFrom).format(DEFAULT_DATETIME_FORMAT)
        : "",
      splitDateTo: fieldsValue.splitDateT
        ? moment(fieldsValue.splitDateTo).format(DEFAULT_DATETIME_FORMAT)
        : "",
      workOrderDateFrom: fieldsValue.workOrderDateFrom
        ? moment(fieldsValue.workOrderDateFrom).format(DEFAULT_DATETIME_FORMAT)
        : "",
      workOrderDateTo: fieldsValue.workOrderDateTo
        ? moment(fieldsValue.workOrderDateTo).format(DEFAULT_DATETIME_FORMAT)
        : "",
    });
  };

  const {
    inventorySemiManufactures: {
      docStatus = [],
      list = [],
      pagination = {},
      siteInfo = {},
      siteList = [],
      enableMap = [],
      workOrderStatusMap = [],
      materialtLotStatusMap = [],
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
    enableMap,
    workOrderStatusMap,
    materialtLotStatusMap,
  };
  const tableListProps = {
    dataSource: list,
    pagination,
    loading: handleFetchListLoading,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="售后在制品盘点半成品报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-service-split-rk05-report/export`}
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

export default connect(({ inventorySemiManufactures, loading }) => ({
  inventorySemiManufactures,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['inventorySemiManufactures/handleFetchList'],
}))(InventorySemiManufactures);
