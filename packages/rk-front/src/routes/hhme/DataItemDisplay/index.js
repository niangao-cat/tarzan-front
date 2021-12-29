/**
 * PumpFilter - 泵浦源组合挑选规则维护
 *
 * @date: 2021/08/23 10:15:52
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import { Button } from 'hzero-ui';
import queryString from 'querystring';
import uuid from 'uuid/v4';

import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import { openTab } from 'utils/menuTab';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  addItemToPagination,
  delItemToPagination,
} from 'utils/utils';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import HeadList from './HeadList';
import LineList from './LineList';
import styles from './index.less';

const DataItemDisplay = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'dataItemDisplay/init',
    });
    dispatch({
      type: 'dataItemDisplay/fetchAreaList',
    }).then(res => {
      if (res) {
        handleSearch();
      }
    });
  }, []);

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = isUndefined(filterRef.current) ? {} : filterNullValueObject(filterRef.current.formFields);
    dispatch({
      type: 'dataItemDisplay/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleSearchLineList = (page = {}) => {
    const { dispatch } = props;
    if (!isEmpty(selectedRows)) {
      dispatch({
        type: 'dataItemDisplay/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          headerId: selectedRows[0].headerId,
        },
      });
    }
  };

  const handleCreateHeadList = () => {
    const { dispatch, dataItemDisplay: { headList, headPagination } } = props;
    if (headList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'dataItemDisplay/updateState',
      payload: {
        headList: [
          {
            headerId: uuid(),
            _status: 'create',
          },
          ...headList,
        ],
        headPagination: addItemToPagination(headList.length, headPagination),
      },
    });
  };

  const handleCreateLineList = () => {
    const { dispatch, dataItemDisplay: { lineList } } = props;
    if (lineList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'dataItemDisplay/updateState',
      payload: {
        lineList: [
          {
            lineId: uuid(),
            _status: 'create',
          },
          ...lineList,
        ],
      },
    });
  };

  const handleEditRecord = (dataSourceName, idName, data, flag) => {
    const { dispatch, dataItemDisplay: { [dataSourceName]: dataSource } } = props;
    if (dataSource.filter(e => ['create', 'update'].includes(e._status)).length > 0 && flag) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行编辑' });
    }
    const newList = dataSource.map(e => e[idName] === data[idName] ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'dataItemDisplay/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  };

  const handleCancelRecord = (dataSourceName, paginationName, idName, data) => {
    const { dispatch, dataItemDisplay: { [dataSourceName]: dataSource, [paginationName]: pagination } } = props;
    const newList = dataSource.filter(e => e[idName] !== data[idName]);
    let payload = {};
    if (paginationName) {
      payload = {
        [dataSourceName]: newList,
        [paginationName]: delItemToPagination(dataSource.length, pagination),
      };
    } else {
      payload = {
        [dataSourceName]: newList,
      };
    }
    dispatch({
      type: 'dataItemDisplay/updateState',
      payload,
    });
  };

  const handleSaveHeadRecord = (record) => {
    const { dispatch } = props;
    let saveData = {};
    record.$form.validateFields((err, value) => {
      if (!err) {
        saveData = { ...record, ...value };
        if (record._status === 'create') {
          delete saveData.headerId;
        }
        delete saveData.$form;
        dispatch({
          type: 'dataItemDisplay/saveHeaderData',
          payload: saveData,
        }).then(res => {
          if (res) {
            notification.success();
            handleSearch();
          }
        });
      }
    });
  };

  const handleSaveLineRecord = (record) => {
    const { dispatch } = props;
    let saveData = {};
    record.$form.validateFields((err, value) => {
      if (!err) {
        saveData = { ...record, ...value, headerId: selectedRows[0].headerId };
        if (record._status === 'create') {
          delete saveData.lineId;
        }
        delete saveData.$form;
        dispatch({
          type: 'dataItemDisplay/saveLineData',
          payload: saveData,
        }).then(res => {
          if (res) {
            notification.success();
            handleSearchLineList();
          }
        });;
      }
    });
  };

  const handleChangeSelectedRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  useEffect(() => {
    handleSearchLineList();
  }, [selectedRows]);

  const handleImport = () => {
    openTab({
      key: `/hhme/data-item-display/import/HME_TAG_CHECK_RULE_IMPORT`,
      title: intl.get('hhme.view.message.import').d('导入'),
      search: queryString.stringify({
        action: intl.get('hhme.view.message.import').d('导入'),
      }),
    });
  };

  const {
    fetchListLoading,
    tenantId,
    fetchLineListLoading,
    saveHeaderDataLoading,
    saveLineDataLoading,
    dataItemDisplay: {
      headList = [],
      headPagination = {},
      lineList = [],
      linePagination = {},
      typeList = [],
      priorityList = [],
      areaList = [],
      departmentInfo = {},
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.headerId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    tenantId,
    areaList,
    departmentInfo,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    tenantId,
    typeList,
    areaList,
    departmentInfo,
    dataSource: headList,
    pagination: headPagination,
    rowSelection,
    loading: fetchListLoading || saveHeaderDataLoading,
    onSearch: handleSearch,
    onEditRecord: handleEditRecord,
    onCancelRecord: handleCancelRecord,
    onSave: handleSaveHeadRecord,
  };

  const lineTableList = {
    priorityList,
    tenantId,
    canEdit: !isEmpty(selectedRows) && selectedRows[0]._status !== 'create',
    dataSource: lineList,
    pagination: linePagination,
    loading: fetchLineListLoading || saveLineDataLoading,
    onSearch: handleSearchLineList,
    onEditRecord: handleEditRecord,
    onCancelRecord: handleCancelRecord,
    onCreate: handleCreateLineList,
    onSave: handleSaveLineRecord,
  };

  return (
    <React.Fragment>
      <Header title="数据项展示维护">
        <Button
          type="primary"
          icon="plus"
          onClick={handleCreateHeadList}
        >
          新建
        </Button>
        <Button type="primary" onClick={() => handleImport()}>
          导入
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <HeadList {...listTableProps} />
        </div>
        <div className={styles['head-table']}>
          <LineList {...lineTableList} />
        </div>
      </Content>
    </React.Fragment>
  );
};

export default connect(({ dataItemDisplay, loading }) => ({
  dataItemDisplay,
  fetchListLoading: loading.effects['dataItemDisplay/fetchList'],
  fetchLineListLoading: loading.effects['dataItemDisplay/fetchLineList'],
  saveHeaderDataLoading: loading.effects['dataItemDisplay/saveHeaderData'],
  saveLineDataLoading: loading.effects['dataItemDisplay/saveLineData'],
  fetchHistoryListLoading: loading.effects['dataItemDisplay/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(DataItemDisplay);
