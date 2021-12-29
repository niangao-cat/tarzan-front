/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import { Button } from 'hzero-ui';
import moment from 'moment';

import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getDateTimeFormat,
} from 'utils/utils';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import Drawer from './Drawer';
import HistoryModal from './HistoryModal';
import styles from './index.less';

const ProductDowngrade = (props) => {
  const [ visible, setVisible ] = useState(false);
  const [ historyVisible, setHistoryVisible ] = useState(false);
  const [ selectedRows, setSelectedRows ] = useState([]);
  const [ record, setRecord ] = useState({});
  const filterRef = useRef();

  useEffect(() => {
    handleSearch();
  }, []);

  const handleOpenDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
    setRecord({});
  };

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
      type: 'productDowngrade/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  };

  const handleSaveData = (data = {}) => {
    const { dispatch } = props;
    dispatch({
      type: 'productDowngrade/saveData',
      payload: data,
    }).then(res => {
      if(res) {
        notification.success();
        setVisible(false);
        handleSearch();
      }
    });
  };

  const handleFetchHistoryList = (page, fields = {}) => {
    const { dispatch } = props;
    const value = filterNullValueObject({
      creationDateFrom: !isEmpty(fields.creationDateFrom) ? moment(fields.creationDateFrom).format(getDateTimeFormat()) : null,
      creationDateTo: !isEmpty(fields.creationDateTo) ? moment(fields.creationDateTo).format(getDateTimeFormat()) : null,
    });
    dispatch({
      type: 'productDowngrade/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        downgradeId: selectedRows[0].downgradeId,
        ...value,
      },
    });
  };

  const handleChangeSelectedRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const handleClickRecord = (recordData) => {
    handleOpenDrawer();
    setRecord(recordData);
  };

  const {
    fetchListLoading,
    tenantId,
    saveDataLoading,
    fetchHistoryListLoading,
    productDowngrade: {
      list = [],
      pagination = {},
      historyPagination = {},
      historyList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.downgradeId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    tenantId,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    dataSource: list,
    pagination,
    rowSelection,
    loading: fetchListLoading,
    onSearch: handleSearch,
    onClickRecord: handleClickRecord,
  };

  const drawerProps = {
    record,
    visible,
    tenantId,
    loading: saveDataLoading,
    onOk: handleSaveData,
    onCancel: handleCloseDrawer,
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
      <Header title="产品降级关系维护">
        <Button
          type="primary"
          icon="plus"
          onClick={handleOpenDrawer}
        >
          新建
        </Button>
        <Button
          type="default"
          disabled={isEmpty(selectedRows)}
          onClick={handleOpenHistoryModal}
        >
          修改历史
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <ListTable {...listTableProps} />
        </div>
      </Content>
      <Drawer {...drawerProps} />
      <HistoryModal {...historyModalProps} />
    </React.Fragment>
  );
};

export default connect(({ productDowngrade, loading }) => ({
  productDowngrade,
  fetchListLoading: loading.effects['productDowngrade/fetchList'],
  saveDataLoading: loading.effects['productDowngrade/saveData'],
  fetchHistoryListLoading: loading.effects['productDowngrade/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(ProductDowngrade);
