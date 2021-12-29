/*
 * @Description: 月度计划达成率报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-09 17:11:23
 * @LastEditTime: 2021-03-11 15:09:38
 */

import React, { useRef, Fragment, useMemo, useEffect } from 'react';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Table } from 'hzero-ui';

import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import ExcelExport from 'components/ExcelExport';

import FilterForm from './FilterForm';

const MonthlyPlanAchievementRateReport = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'monthlyPlanAchievementRateReport/fetchAreaList',
    });
    dispatch({
      type: 'monthlyPlanAchievementRateReport/fetchDepartment',
    });
  }, []);

  const handleFetchList = (fields = {}) => {
    const {
      dispatch,
    } = props;
    const value = handleGetFormValue();
    dispatch({
      type: 'monthlyPlanAchievementRateReport/handleFetchList',
      payload: {
        ...value,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  };

  const handleGetFormValue = () => {
    const fieldsValue = isEmpty(countRef.current) ? {} :countRef.current.formFields;
    return filterNullValueObject({
      ...fieldsValue,
      queryMonth: isEmpty(fieldsValue.queryMonth)
        ? null
        : moment(fieldsValue.queryMonth).format("YYYY-MM"),
    });
  };

  const columns = useMemo(
    () => [
      {
        title: '部门',
        dataIndex: 'areaName',
        width: 100,
      },
      {
        title: '产线编码',
        dataIndex: 'prodLineCode',
        width: 100,
      },
      {
        title: '产线描述',
        dataIndex: 'prodLineName',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 100,
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 100,
      },
      {
        title: '计划数量',
        dataIndex: 'planQty',
        width: 100,
      },
      {
        title: '完工数量',
        dataIndex: 'qty',
        width: 100,
      },
      {
        title: '入库数量',
        dataIndex: 'actualQty',
        width: 100,
      },
      {
        title: '达成率',
        dataIndex: 'planReachRate',
        width: 100,
      },
    ],
    []
  );

  const {
    monthlyPlanAchievementRateReport: {
      list = [],
      pagination = {},
      areaList = [],
      departmentInfo = {},
    },
    handleFetchListLoading,
    tenantId,
  } = props;
  const filterFormProps = {
    tenantId,
    areaList,
    departmentInfo,
    handleFetchList,
  };
  return (
    <Fragment>
      <Header title="月度计划达成率报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${tenantId}/hme-monthly-plan/export`} // 路径
          otherButtonProps={{ type: 'primary' }}
          queryParams={handleGetFormValue()}
        />
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <Table
          bordered
          loading={handleFetchListLoading}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={page => handleFetchList(page)}
          rowKey="ssnInspectResultHeaderId"
        />
      </Content>
      <ModalContainer ref={registerContainer} />
    </Fragment>
  );
};

export default connect(({ monthlyPlanAchievementRateReport, loading }) => ({
  monthlyPlanAchievementRateReport,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['monthlyPlanAchievementRateReport/handleFetchList'],
}))(MonthlyPlanAchievementRateReport);
