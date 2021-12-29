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
import qs from 'querystring';

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

const AfterSaleQuotationReport = (props) => {
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    const routerParam = qs.parse(props.location.search.substr(1));
    dispatch({
      type: 'afterSaleQuotationReport/init',
    });
    dispatch({
      type: 'afterSaleQuotationReport/fetchAreaList',
    });
    if (!isEmpty(routerParam)) {
      filterRef.current.formFields.setFieldsValue({ serialNumber: [routerParam.serialNumber] });
      handleSearch();
    }

  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = handleGetFormValue();
    dispatch({
      type: 'afterSaleQuotationReport/fetchList',
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
          const { updateTimeFrom, updateTimeTo, creationDateTo, creationDateFrom, submissionTimeFrom, submissionTimeTo, serialNumber, productCode, sapQuotationNo, ...filterValue } = value;
          values = filterNullValueObject({
            ...filterValue,
            serialNumber: isEmpty(serialNumber) ? null : serialNumber.toString(),
            productCode: isEmpty(productCode) ? null : productCode.toString(),
            sapQuotationNo: isEmpty(sapQuotationNo) ? null : sapQuotationNo.toString(),
            updateTimeFrom: updateTimeFrom ? moment(updateTimeFrom).format(getDateTimeFormat()) : null,
            updateTimeTo: updateTimeTo ? moment(updateTimeTo).format(getDateTimeFormat()) : null,
            creationDateTo: creationDateTo ? moment(creationDateTo).format(getDateTimeFormat()) : null,
            creationDateFrom: creationDateFrom ? moment(creationDateFrom).format(getDateTimeFormat()) : null,
            submissionTimeFrom: submissionTimeFrom ? moment(submissionTimeFrom).format(getDateTimeFormat()) : null,
            submissionTimeTo: submissionTimeTo ? moment(submissionTimeTo).format(getDateTimeFormat()) : null,
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
    afterSaleQuotationReport: {
      list = [],
      pagination = {},
      snStatusList = [],
      quotationStatusList = [],
      returnTypeList = [],
    },
  } = props;
  const filterProps = {
    tenantId,
    snStatusList,
    quotationStatusList,
    returnTypeList,
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
      <Header title="售后报价单报表">
        <ExcelExport
          exportAsync
          exportUrl={`${ReportHost}/v1/${tenantId}/Hme-after-sales-quotation/export`} // 路径
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue}
          fileName="数据项展示报表.xlsx"
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

export default connect(({ afterSaleQuotationReport, loading }) => ({
  afterSaleQuotationReport,
  fetchListLoading: loading.effects['afterSaleQuotationReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))(AfterSaleQuotationReport);
