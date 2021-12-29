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

const PumpFilterRule = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    handleSearch();
    dispatch({
      type: 'pumpFilterRule/init',
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
      type: 'pumpFilterRule/fetchList',
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
        type: 'pumpFilterRule/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          ruleHeadId: selectedRows[0].ruleHeadId,
        },
      });
    }
  };

  const handleCreateHeadList = () => {
    const { dispatch, pumpFilterRule: { headList, headPagination } } = props;
    if (headList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'pumpFilterRule/updateState',
      payload: {
        headList: [
          {
            ruleHeadId: uuid(),
            _status: 'create',
          },
          ...headList,
        ],
        headPagination: addItemToPagination(headList.length, headPagination),
      },
    });
  };

  const handleCreateLineList = () => {
    const { dispatch, pumpFilterRule: { lineList } } = props;
    if (lineList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'pumpFilterRule/updateState',
      payload: {
        lineList: [
          {
            ruleLineId: uuid(),
            _status: 'create',
          },
          ...lineList,
        ],
      },
    });
  };

  const handleEditRecord = (dataSourceName, idName, data, flag) => {
    const { dispatch, pumpFilterRule: { [dataSourceName]: dataSource } } = props;
    const newList = dataSource.map(e => e[idName] === data[idName] ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'pumpFilterRule/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  };

  const handleCancelRecord = (dataSourceName, paginationName, idName, data) => {
    const { dispatch, pumpFilterRule: { [dataSourceName]: dataSource, [paginationName]: pagination } } = props;
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
      type: 'pumpFilterRule/updateState',
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
          delete saveData.ruleHeadId;
        }
        delete saveData.$form;
        dispatch({
          type: 'pumpFilterRule/saveHeaderList',
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
        saveData = { ...record, ...value, ruleHeadId: selectedRows[0].ruleHeadId };
        if (record._status === 'create') {
          delete saveData.ruleLineId;
        }
        delete saveData.$form;
        dispatch({
          type: 'pumpFilterRule/saveLineList',
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

  const handleFetchHistoryList = (page = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpFilterRule/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ruleHeadId: selectedRows[0].ruleHeadId,
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
    pumpFilterRule: {
      headList = [],
      headPagination = {},
      lineList = [],
      historyPagination = {},
      historyList = [],
      typeList = [],
      priorityList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.ruleHeadId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    tenantId,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    tenantId,
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
    typeList,
    priorityList,
    tenantId,
    canEdit: !isEmpty(selectedRows) && selectedRows[0]._status !== 'create',
    dataSource: lineList,
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
      <Header title="泵浦源组合挑选规则维护">
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

export default connect(({ pumpFilterRule, loading }) => ({
  pumpFilterRule,
  fetchListLoading: loading.effects['pumpFilterRule/fetchList'],
  fetchLineListLoading: loading.effects['pumpFilterRule/fetchLineList'],
  saveHeaderListLoading: loading.effects['pumpFilterRule/saveHeaderList'],
  saveLineListLoading: loading.effects['pumpFilterRule/saveLineList'],
  fetchHistoryListLoading: loading.effects['pumpFilterRule/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(PumpFilterRule);
