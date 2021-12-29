/**
 * CosTestYield - COS测试良率维护
 * *
 * @date: 2021/09/06 14:44:42
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
import ListTable from './ListTable';
import HistoryModal from './HistoryModal';

const CosTestYield = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    handleSearch();
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
      type: 'cosTestYield/fetchList',
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
        type: 'cosTestYield/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          testId: selectedRows[0].testId,
        },
      });
    }
  };

  const handleCreateHeadList = () => {
    const { dispatch, cosTestYield: { headList, headPagination } } = props;
    if (headList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'cosTestYield/updateState',
      payload: {
        headList: [
          {
            testId: uuid(),
            _status: 'create',
          },
          ...headList,
        ],
        headPagination: addItemToPagination(headList.length, headPagination),
      },
    });
  };

  const handleEditRecord = (dataSourceName, idName, data, flag) => {
    const { dispatch, cosTestYield: { [dataSourceName]: dataSource } } = props;
    const newList = dataSource.map(e => e[idName] === data[idName] ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'cosTestYield/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  };

  const handleCancelRecord = (dataSourceName, paginationName, idName, data) => {
    const { dispatch, cosTestYield: { [dataSourceName]: dataSource, [paginationName]: pagination } } = props;
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
      type: 'cosTestYield/updateState',
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
          delete saveData.testId;
        }
        delete saveData.$form;
        dispatch({
          type: 'cosTestYield/saveHeaderList',
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

  const handleFetchHistoryList = (page = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'cosTestYield/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        testId: selectedRows[0].testId,
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
    saveHeaderListLoading,
    cosTestYield: {
      headList = [],
      headPagination = {},
      historyPagination = {},
      historyList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.testId),
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
      <Header title="COS测试良率维护">
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
        <ListTable {...listTableProps} />
      </Content>
      <HistoryModal {...historyModalProps} />
    </React.Fragment>
  );
};

export default connect(({ cosTestYield, loading }) => ({
  cosTestYield,
  fetchListLoading: loading.effects['cosTestYield/fetchList'],
  saveHeaderListLoading: loading.effects['cosTestYield/saveHeaderList'],
  fetchHistoryListLoading: loading.effects['cosTestYield/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(CosTestYield);
