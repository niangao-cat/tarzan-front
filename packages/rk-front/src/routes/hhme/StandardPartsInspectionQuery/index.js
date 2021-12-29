/*
 * @Description: 标准件检验结果查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 15:20:38
 * @LastEditTime: 2021-03-15 15:46:59
*/

import React, { useRef, Fragment, useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { isEmpty, isUndefined } from 'lodash';
import { Content, Header } from 'components/Page';
import { getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import HeadTable from './HeadTable';
// import LineTable from './LineTable';

const prefix = `${Host}`;

const StandardPartsInspectionQuery = (props) => {
  const countRef = useRef();
  const headTableRef = useRef();

  const [selectedHeadRows, setSelectedHeadRows] = useState([]);

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'standardPartsInspectionQuery/batchLovData',
      payload: {
        tenantId,
      },
    });
  }, []);

  // useEffect(() => {
  //   if (selectedHeadRows[0]) {
  //     handleFetchLineList();
  //   }
  // }, [selectedHeadRows]);

  // 查询头
  const handleFetchHeadList = useCallback((fields = {}) => {
    const { dispatch } = props;
    const fieldsValue = countRef.current.formFields;
    // console.log('fieldsValue.shiftDateFrom==', '{', fieldsValue.shiftDateFrom, '}');
    dispatch({
      type: 'standardPartsInspectionQuery/handleFetchHeadList',
      payload: {
        ...fieldsValue,
        createdByList: isUndefined(fieldsValue.createdByList)
          ? []
          : fieldsValue.createdByList.length === 0
            ? []
            : fieldsValue.createdByList.split(","),
        materialIdList: isUndefined(fieldsValue.materialIdList)
          ? []
          : fieldsValue.materialIdList.length === 0
            ? []
            : fieldsValue.materialIdList.split(","),
        processIdList: isUndefined(fieldsValue.processIdList)
          ? []
          : fieldsValue.processIdList.length === 0
            ? []
            : fieldsValue.processIdList.split(","),
        shiftDateFrom: isUndefined(fieldsValue.shiftDateFrom)
          ? null
          : fieldsValue.shiftDateFrom === null
            ? null
            : moment(fieldsValue.shiftDateFrom).format(DEFAULT_DATETIME_FORMAT),
        shiftDateTo: isUndefined(fieldsValue.shiftDateTo)
          ? null
          : fieldsValue.shiftDateTo === null
            ? null
            : moment(fieldsValue.shiftDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 头数据的选中
  const onFetchLine = (selectedRowKeys) => {
    setSelectedHeadRows(selectedRowKeys);
  };

  // 导出参数
  const exportParams = (fields = {}) => {
    const fieldsValue = countRef.current.formFields;
    return {
      ...fieldsValue,
      createdByList: isUndefined(fieldsValue.createdByList)
        ? []
        : fieldsValue.createdByList.length === 0
          ? []
          : fieldsValue.createdByList.split(","),
      materialIdList: isUndefined(fieldsValue.materialIdList)
        ? []
        : fieldsValue.materialIdList.length === 0
          ? []
          : fieldsValue.materialIdList.split(","),
      processIdList: isUndefined(fieldsValue.processIdList)
        ? []
        : fieldsValue.processIdList.length === 0
          ? []
          : fieldsValue.processIdList.split(","),
      shiftDateFrom: isUndefined(fieldsValue.shiftDateFrom)
        ? ''
        : fieldsValue.shiftDateFrom === null
          ? ''
          : moment(fieldsValue.shiftDateFrom).format(DEFAULT_DATETIME_FORMAT),
      shiftDateTo: isUndefined(fieldsValue.shiftDateTo)
        ? ''
        : fieldsValue.shiftDateTo === null
          ? ''
          : moment(fieldsValue.shiftDateTo).format(DEFAULT_DATETIME_FORMAT),
      page: isEmpty(fields) ? {} : fields,
    };
  };

  // 查询行
  // const handleFetchLineList = (fields = {}) => {
  //   const { dispatch } = props;
  //   dispatch({
  //     type: 'standardPartsInspectionQuery/handleFetchLineList',
  //     payload: {
  //       ssnInspectResultHeaderId: selectedHeadRows[0],
  //       page: isEmpty(fields) ? {} : fields,
  //     },
  //   });
  // };

  const {
    standardPartsInspectionQuery: {
      headList = [],
      headListPagination = {},
      workWay = [],
      // lineList = [],
      // lineListPagination = {},
    },
    handleFetchHeadListLoading,
    // handleFetchLineListLoading,
    tenantId,
  } = props;
  const filterFormProps = {
    handleFetchList: handleFetchHeadList,
    workWay,
    tenantId,
  };
  const headTableProps = {
    dataSource: headList,
    pagination: headListPagination,
    loading: handleFetchHeadListLoading,
    selectedHeadRows,
    handleFetchHeadList,
    onSelectHead: onFetchLine,
  };
  // const lineTableProps = {
  //   dataSource: lineList,
  //   pagination: lineListPagination,
  //   loading: handleFetchLineListLoading,
  //   handleFetchLineList,(
  // };


  return (
    <Fragment>
      <Header title="标准件检验结果查询">
        <ExcelExport
          requestUrl={`${prefix}/v1/${tenantId}/ssn-inspect-result/header-lines/export`}
          queryParams={()=>exportParams()}
        />
      </Header>
      <Content>
        <FilterForm {...filterFormProps} wrappedComponentRef={countRef} />
        <HeadTable {...headTableProps} ref={headTableRef} />
        {/* <LineTable {...lineTableProps} /> */}
      </Content>
    </Fragment>
  );
};

export default connect(({ standardPartsInspectionQuery, loading }) => ({
  standardPartsInspectionQuery,
  tenantId: getCurrentOrganizationId(),
  handleFetchHeadListLoading: loading.effects['standardPartsInspectionQuery/handleFetchHeadList'],
  handleFetchLineListLoading: loading.effects['standardPartsInspectionQuery/handleFetchLineList'],
}))(StandardPartsInspectionQuery);
