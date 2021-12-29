/*
 * @Description: 售后在制品盘点成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */

import React, { useRef, Fragment, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { isArray, isEmpty } from 'lodash';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import FilterForm from './FilterForm';
import TableList from './TableList';

const dateTimeFormat = getDateTimeFormat();


const InventoryFinishedProduct = (props) => {
  const countRef = useRef();

  useEffect(() => {
    const { dispatch, tenantId } = props;
    dispatch({
      type: 'inventoryFinishedProduct/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'inventoryFinishedProduct/fetchWarehouseTypeList',
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
      type: 'inventoryFinishedProduct/handleFetchList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }, []);

  // 导出
  const handleGetFormValue = () => {
    const fieldsValue = countRef.current ? countRef.current.formFields : {};
    const { splitTimeFrom, splitTimeTo, actualEndDateFrom, actualEndDateTo, wordOrderStatus, materialLotCodeStatus, ...otherValue } = fieldsValue;
    return filterNullValueObject({
      ...otherValue,
      splitTimeFrom: isEmpty(splitTimeFrom)
        ? null : splitTimeFrom.format(dateTimeFormat),
      splitTimeTo: isEmpty(splitTimeTo)
        ? null : splitTimeTo.format(dateTimeFormat),
      actualEndDateFrom: isEmpty(actualEndDateFrom)
        ? null : actualEndDateFrom.format(dateTimeFormat),
      actualEndDateTo: isEmpty(actualEndDateTo)
        ? null : actualEndDateTo.format(dateTimeFormat),
      wordOrderStatus: isArray(wordOrderStatus) ? wordOrderStatus.join(',') : null,
      materialLotCodeStatus: isArray(materialLotCodeStatus) ? materialLotCodeStatus.join(',') : null,
    });
  };

  // 表格展开或关闭
  const onExpandTable = (expanded, record) => {
    const {
      dispatch,
      inventoryFinishedProduct: { expendedKeyList = [] },
    } = this.props;
    const keyList = expendedKeyList;
    let rowKey = record.unfoldFlag ? 'event' : 'request';
    rowKey = `${rowKey}_${record.snNum}`;
    if (expanded) {
      keyList.push(rowKey);
    } else {
      arrayRemoveItem(keyList, rowKey);
    }
    dispatch({
      type: 'inventoryFinishedProduct/updateState',
      payload: {
        expendedKeyList: keyList,
      },
    });
  };

  // 数组的删除
  const arrayRemoveItem = (arr, delVal) => {
    if (arr instanceof Array) {
      const index = arr.indexOf(delVal);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
  };

  const {
    inventoryFinishedProduct: {
      docStatus = [],
      list = [],
      pagination = {},
      siteInfo = {},
      siteList = [],
      expendedKeyList = [],
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
    warehouseTypeList,
    wordOrderStatusList,
    materialLotCodeStatusList,
    flagList,
  };
  const tableListProps = {
    dataSource: list,
    pagination,
    loading: handleFetchListLoading,
    handleFetchList,
    expendedKeyList,
    onExpandTable,
  };
  return (
    <Fragment>
      <Header title="售后在制品盘点成品报表">
        <ExcelExport
          exportAsync
          requestUrl={`/mes-report/v1/${getCurrentOrganizationId()}/hme-inventory-end-product/inventory-end-product-export`}
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

export default connect(({ inventoryFinishedProduct, loading }) => ({
  inventoryFinishedProduct,
  tenantId: getCurrentOrganizationId(),
  handleFetchListLoading: loading.effects['inventoryFinishedProduct/handleFetchList'],
}))(InventoryFinishedProduct);
