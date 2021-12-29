/**
 * CosElectricFilter - COS筛选电流点维护
 * @date: 2021/08/18 15:58:16
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
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import HistoryModal from './HistoryModal';
import styles from './index.less';

const CosElectricFilter = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    handleSearch();
    dispatch({
      type: 'cosElectricFilter/init',
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
      type: 'cosElectricFilter/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleCreate = () => {
    const { dispatch, cosElectricFilter: { dataSource, pagination } } = props;
    dispatch({
      type: 'cosElectricFilter/updateState',
      payload: {
        dataSource: [
          {
            cosId: uuid(),
            _status: 'create',
          },
          ...dataSource,
        ],
        pagination: addItemToPagination(dataSource.length, pagination),
      },
    });
  };

  const handleEditRecord = (data, flag) => {
    const { dispatch, cosElectricFilter: { dataSource } } = props;
    const newList = dataSource.map(e => e.cosId === data.cosId ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'cosElectricFilter/updateState',
      payload: {
        dataSource: newList,
      },
    });
  };

  const handleCancelRecord = (data) => {
    const { dispatch, cosElectricFilter: { dataSource, pagination } } = props;
    const newList = dataSource.filter(e => e.cosId !== data.cosId);
    dispatch({
      type: 'cosElectricFilter/updateState',
      payload: {
        dataSource: newList,
        pagination: delItemToPagination(dataSource.length, pagination),
      },
    });
  };

  const handleSave = (record) => {
    const { dispatch } = props;
    const saveData = { ...record, ...record.$form.getFieldsValue() };
    if (record._status === 'create') {
      delete saveData.cosId;
    }
    delete saveData._status;
    delete saveData.$form;
    dispatch({
      type: 'cosElectricFilter/save',
      payload: saveData,
    }).then(() => {
      handleSearch();
    });
  };

  const handleFetchHistoryList = (page) => {
    const { dispatch } = props;
    dispatch({
      type: 'cosElectricFilter/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        cosId: selectedRows[0].cosId,
      },
    });
  };

  const handleChangeSelectedRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const {
    fetchListLoading,
    tenantId,
    fetchHistoryListLoading,
    saveDataLoading,
    cosElectricFilter: {
      dataSource = [],
      pagination = {},
      historyPagination = {},
      historyList = [],
      cosTypeList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.cosId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    cosTypeList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    cosTypeList,
    tenantId,
    dataSource,
    pagination,
    rowSelection,
    loading: fetchListLoading || saveDataLoading,
    onSearch: handleSearch,
    onEditRecord: handleEditRecord,
    onCancelRecord: handleCancelRecord,
    onSave: handleSave,
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
      <Header title="COS筛选电流点维护">
        <Button
          type="primary"
          icon="plus"
          onClick={handleCreate}
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
          <ListTable {...listTableProps} />
        </div>
      </Content>
      <HistoryModal {...historyModalProps} />
      <ModalContainer ref={registerContainer} />
    </React.Fragment>
  );
};

export default connect(({ cosElectricFilter, loading }) => ({
  cosElectricFilter,
  fetchListLoading: loading.effects['cosElectricFilter/fetchList'],
  saveDataLoading: loading.effects['cosElectricFilter/save'],
  fetchHistoryListLoading: loading.effects['cosElectricFilter/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(CosElectricFilter);
