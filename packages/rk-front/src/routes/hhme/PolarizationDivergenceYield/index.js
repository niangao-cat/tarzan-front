/**
 * PumpFilterRule - 泵浦源组合挑选规则维护
 *
 * @date: 2021/08/23 10:15:52
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
 */


import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import { Button } from 'hzero-ui';
import uuid from 'uuid/v4';


import { Header, Content } from 'components/Page';
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
import HistoryModal from './HistoryModal';
import styles from './index.less';

const PolarizationDivergenceYield = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    handleSearch();
    dispatch({
      type: 'polarizationDivergenceYield/init',
    });
  }, []);

  const handleOpenHistoryModal = () => {
    setHistoryVisible(true);
    handleFetchHistoryList();
  };

  const handleCloseHistoryModal = () => {
    setHistoryVisible(false);
  };

  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    const filterValue = isUndefined(filterRef.current) ? {} : filterNullValueObject(filterRef.current.formFields);
    dispatch({
      type: 'polarizationDivergenceYield/fetchList',
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
        type: 'polarizationDivergenceYield/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          heardId: selectedRows[0].headerId,
        },
      });
    }
  };

  const handleCreateHeadList = () => {
    const { dispatch, polarizationDivergenceYield: { headList, headPagination } } = props;
    if (headList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'polarizationDivergenceYield/updateState',
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
    const { dispatch, polarizationDivergenceYield: { lineList } } = props;
    if (lineList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'polarizationDivergenceYield/updateState',
      payload: {
        lineList: [
          {
            lineId: uuid(),
            headerId: selectedRows[0].headerId,
            _status: 'create',
          },
          ...lineList,
        ],
      },
    });
  };

  const handleEditRecord = (dataSourceName, idName, data, flag) => {
    const { dispatch, polarizationDivergenceYield: { [dataSourceName]: dataSource } } = props;
    const newList = dataSource.map(e => e[idName] === data[idName] ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'polarizationDivergenceYield/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  };

  const handleCancelRecord = (dataSourceName, paginationName, idName, data) => {
    const { dispatch, polarizationDivergenceYield: { [dataSourceName]: dataSource, [paginationName]: pagination } } = props;
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
      type: 'polarizationDivergenceYield/updateState',
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
          type: 'polarizationDivergenceYield/saveHeaderList',
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
        saveData = { ...record, ...value };
        if (record._status === 'create') {
          delete saveData.lineId;
        }
        delete saveData.$form;
        dispatch({
          type: 'polarizationDivergenceYield/saveLineList',
          payload: {
            ...saveData,
            heardId: saveData.headerId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            handleSearchLineList();
          }
        });;
      }
    });
  };

  const handleFetchHistoryList = (page = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'polarizationDivergenceYield/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        heardId: selectedRows[0].headerId,
      },
    });
  };

  const handleChangeSelectedRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  useEffect(() => {
    handleSearchLineList();
  }, [selectedRows]);

  const {
    fetchListLoading,
    tenantId,
    fetchHistoryListLoading,
    fetchLineListLoading,
    saveHeaderListLoading,
    saveLineListLoading,
    polarizationDivergenceYield: {
      headList = [],
      headPagination = {},
      lineList = [],
      linePagination = {},
      historyPagination = {},
      historyList = [],
      testTypeList = [],
      testObjectList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.headerId),
    onChange: handleChangeSelectedRows,
    getCheckboxProps: ((record) => ({
      disabled: record._status,
    })),
  };
  const filterProps = {
    tenantId,
    testTypeList,
    testObjectList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    tenantId,
    testTypeList,
    testObjectList,
    dataSource: headList,
    pagination: headPagination,
    rowSelection,
    loading: fetchListLoading || saveHeaderListLoading,
    onSearch: handleSearch,
    onEditRecord: handleEditRecord,
    onCancelRecord: handleCancelRecord,
    onSave: handleSaveHeadRecord,
  };

  const lineTableList = {
    tenantId,
    selectedRows,
    canEdit: !isEmpty(selectedRows) && selectedRows[0]._status !== 'create' && selectedRows[0].testType === 'PART' && selectedRows[0].testObject === 'POLARIZATION',
    dataSource: lineList,
    pagination: linePagination,
    loading: fetchLineListLoading || saveLineListLoading,
    onSearch: handleSearchLineList,
    onEditRecord: handleEditRecord,
    onCancelRecord: handleCancelRecord,
    onCreate: handleCreateLineList,
    onSave: handleSaveLineRecord,
  };

  const historyModalProps = {
    visible: historyVisible,
    dataSource: historyList,
    pagination: historyPagination,
    loading: fetchHistoryListLoading,
    onCancel: handleCloseHistoryModal,
    onSearch: handleFetchHistoryList,
  };

  return (
    <React.Fragment>
      <Header title="偏振度&发散角良率维护">
        <Button
          type="primary"
          icon="plus"
          onClick={handleCreateHeadList}
        >
          新建
        </Button>
        <Button
          type="default"
          disabled={isEmpty(selectedRows)}
          onClick={handleOpenHistoryModal}
        >
          历史
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
      <HistoryModal {...historyModalProps} />
    </React.Fragment>
  );
};

export default connect(({ polarizationDivergenceYield, loading }) => ({
  polarizationDivergenceYield,
  fetchListLoading: loading.effects['polarizationDivergenceYield/fetchList'],
  fetchLineListLoading: loading.effects['polarizationDivergenceYield/fetchLineList'],
  saveHeaderListLoading: loading.effects['polarizationDivergenceYield/saveHeaderList'],
  saveLineListLoading: loading.effects['polarizationDivergenceYield/saveLineList'],
  fetchHistoryListLoading: loading.effects['polarizationDivergenceYield/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(PolarizationDivergenceYield);
