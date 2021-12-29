/**
 * DataItemDisplayReport - 数据项展示维护
 * *
 * @date: 2021/09/03 09:54:42
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

const DataItemDisplayReport = (props) => {
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'dataItemDisplayReport/init',
    });
    dispatch({
      type: 'dataItemDisplayReport/fetchAreaList',
    });
  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = handleGetFormValue();
    dispatch({
      type: 'dataItemDisplayReport/fetchList',
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
          const { siteOutDateFrom, siteOutDateTo, materialLotCode, workOrderNum, materialCode, ...filterValue } = value;
          values = filterNullValueObject({
            ...filterValue,
            materialLotCode: isEmpty(materialLotCode) ? null : materialLotCode.toString(),
            workOrderNum: isEmpty(workOrderNum) ? null : workOrderNum.toString(),
            materialCode: isEmpty(materialCode) ? null : materialCode.toString(),
            siteOutDateFrom: siteOutDateFrom ? moment(siteOutDateFrom).format(getDateTimeFormat()) : null,
            siteOutDateTo: siteOutDateFrom ? moment(siteOutDateTo).format(getDateTimeFormat()) : null,
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
    dataItemDisplayReport: {
      list = [],
      pagination = {},
      areaList = [],
      departmentInfo = {},
      typeList = [],
    },
  } = props;
  const filterProps = {
    tenantId,
    typeList,
    areaList,
    departmentInfo,
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
      <Header title="数据项展示报表">
        <ExcelExport
          exportAsync
          exportUrl={`${ReportHost}/v1/${tenantId}/hme-tag-checks/async-export`} // 路径
          exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-tag-checks/async-export`}
          createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-tag-checks/create-task`}
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue}
          fileName="数据项展示报表.xlsx"
          method="POST"
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

export default connect(({ dataItemDisplayReport, loading }) => ({
  dataItemDisplayReport,
  fetchListLoading: loading.effects['dataItemDisplayReport/fetchList'],
  tenantId: getCurrentOrganizationId(),
}))(DataItemDisplayReport);
