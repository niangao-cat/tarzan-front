/**
 * PumpFilterRule - 泵浦源组合挑选规则维护
 *
 * @date: 2021/08/23 10:15:52
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';

import ExcelExport from 'components/ExcelExport';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const PumpFilterReport = (props) => {
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    handleSearch();
    dispatch({
      type: 'pumpFilterReport/init',
    });
  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = handleGetFieldValue();
    dispatch({
      type: 'pumpFilterReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleGetFieldValue = () => {
    const filterValue = isUndefined(filterRef.current) ? {} : filterRef.current.formFields;
    const { materialLotCode, workOrderNum, oldContainerCode, newContainerCode, ruleCode, selectionLot, combMaterialLotCode, releaseWorkOrderNum, creationDateFrom, creationDateTo, packedDateFrom, packedDateTo, ...otherValues } = filterValue;
    return filterNullValueObject({
      ...otherValues,
      materialLotCode: isEmpty(materialLotCode) ? null : materialLotCode.toString(),
      workOrderNum: isEmpty(workOrderNum) ? null : workOrderNum.toString(),
      oldContainerCode: isEmpty(oldContainerCode) ? null : oldContainerCode.toString(),
      newContainerCode: isEmpty(newContainerCode) ? null : newContainerCode.toString(),
      ruleCode: isEmpty(ruleCode) ? null : ruleCode.toString(),
      selectionLot: isEmpty(selectionLot) ? null : selectionLot.toString(),
      combMaterialLotCode: isEmpty(combMaterialLotCode) ? null : combMaterialLotCode.toString(),
      releaseWorkOrderNum: isEmpty(releaseWorkOrderNum) ? null : releaseWorkOrderNum.toString(),
      creationDateFrom: isEmpty(creationDateFrom) ? null : moment(creationDateFrom).format(getDateTimeFormat()),
      creationDateTo: isEmpty(creationDateTo) ? null : moment(creationDateTo).format(getDateTimeFormat()),
      packedDateFrom: isEmpty(packedDateFrom) ? null : moment(packedDateFrom).format(getDateTimeFormat()),
      packedDateTo: isEmpty(packedDateTo) ? null : moment(packedDateTo).format(getDateTimeFormat()),
    });
  };

  const {
    fetchListLoading,
    tenantId,
    pumpFilterReport: {
      list = [],
      pagination = {},
      statusList = [],
      siteInfo = {},
    },
  } = props;
  const filterProps = {
    tenantId,
    statusList,
    siteInfo,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };
  const listTableProps = {
    dataSource: list,
    pagination,
    loading: fetchListLoading,
    onSearch: handleSearch,
  };

  return (
    <React.Fragment>
      <Header title="泵浦源预筛选报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${tenantId}/hme-pump-selection-details/export`} // 路径
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFieldValue}
        />
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <ListTable {...listTableProps} />
        </div>
      </Content>
      <ModalContainer ref={registerContainer} />
    </React.Fragment>
  );
};

export default connect(({ pumpFilterReport, loading }) => ({
  pumpFilterReport,
  fetchListLoading: loading.effects['pumpFilterReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))(PumpFilterReport);
