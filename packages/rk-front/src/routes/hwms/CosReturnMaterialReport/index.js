/**
 * AfterSaleQuotationReport - 售后报价单
 * *
 * @date: 2021/10/18 10:47:03
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */

import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import moment from 'moment';

import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';

const CosReturnMaterialReport = (props) => {
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'cosReturnMaterialReport/init',
    });
  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = handleGetFormValue();
    dispatch({
      type: 'cosReturnMaterialReport/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleGetFormValue = () => {
    let values = false;
    if (!isUndefined(filterRef.current) && filterRef.current.formFields) {
      filterRef.current.formFields.validateFields((err, value) => {
        if (!err) {
          const { operateDateFrom, operateDateTo, waferNums, workOrderNums, returnMaterialLotCodes, targetMaterialLotCodes, supplierLots, ...filterValue } = value;
          values = filterNullValueObject({
            ...filterValue,
            waferNums: isEmpty(waferNums) ? null : waferNums.toString(),
            workOrderNums: isEmpty(workOrderNums) ? null : workOrderNums.toString(),
            returnMaterialLotCodes: isEmpty(returnMaterialLotCodes) ? null : returnMaterialLotCodes.toString(),
            targetMaterialLotCodes: isEmpty(targetMaterialLotCodes) ? null : targetMaterialLotCodes.toString(),
            supplierLots: isEmpty(supplierLots) ? null : supplierLots.toString(),
            operateDateFrom: operateDateFrom ? moment(operateDateFrom).format(getDateTimeFormat()) : null,
            operateDateTo: operateDateTo ? moment(operateDateTo).format(getDateTimeFormat()) : null,
          });
        }
      });
    }
    return values;
  };


  const {
    fetchListLoading,
    tenantId,
    saveHeaderDataLoading,
    cosReturnMaterialReport: {
      list = [],
      pagination = {},
      cosTypeList = [],
      methodList = [],
    },
  } = props;
  const filterProps = {
    tenantId,
    cosTypeList,
    methodList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    dataSource: list,
    pagination,
    loading: fetchListLoading || saveHeaderDataLoading,
    onSearch: handleSearch,
  };

  return (
    <React.Fragment>
      <Header title="COS退料记录表">
        <ExcelExport
          exportAsync
          requestUrl={`${ReportHost}/v1/${tenantId}/hme-cos-return/export`} // 路径
          exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-cos-return/async-export`}
          createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-cos-return/create-task`}
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue}
          fileName="COS退料报表.xlsx"
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

export default connect(({ cosReturnMaterialReport, loading }) => ({
  cosReturnMaterialReport,
  fetchListLoading: loading.effects['cosReturnMaterialReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))(CosReturnMaterialReport);
