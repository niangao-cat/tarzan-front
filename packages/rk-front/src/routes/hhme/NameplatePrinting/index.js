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

const NameplatePrinting = (props) => {
  const [historyVisible, setHistoryVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    handleSearch();
    dispatch({
      type: 'nameplatePrinting/init',
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
      type: 'nameplatePrinting/fetchList',
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
        type: 'nameplatePrinting/fetchLineList',
        payload: {
          page: isEmpty(page) ? {} : page,
          nameplateHeaderId: selectedRows[0].nameplateHeaderId,
        },
      });
    }
  };

  const handleCreateHeadList = () => {
    const { dispatch, nameplatePrinting: { headList, headPagination } } = props;
    if (headList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'nameplatePrinting/updateState',
      payload: {
        headList: [
          {
            nameplateHeaderId: uuid(),
            _status: 'create',
          },
          ...headList,
        ],
        headPagination: addItemToPagination(headList.length, headPagination),
      },
    });
  };

  const handleCreateLineList = () => {
    const { dispatch, nameplatePrinting: { lineList } } = props;
    if (lineList.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      return notification.warning({ description: '当前有未保存规则, 请先保存再进行新增' });
    }
    dispatch({
      type: 'nameplatePrinting/updateState',
      payload: {
        lineList: [
          {
            nameplateLineId: uuid(),
            code: lineList.length > 0 ? lineList[0].code : null,
            _status: 'create',
          },
          ...lineList,
        ],
      },
    });
  };

  const handleEditRecord = (dataSourceName, idName, data, flag) => {
    const { dispatch, nameplatePrinting: { [dataSourceName]: dataSource } } = props;
    const newList = dataSource.map(e => e[idName] === data[idName] ? { ...data, _status: flag ? 'update' : '' } : e);
    dispatch({
      type: 'nameplatePrinting/updateState',
      payload: {
        [dataSourceName]: newList,
      },
    });
  };

  const handleCancelRecord = (dataSourceName, paginationName, idName, data) => {
    const { dispatch, nameplatePrinting: { [dataSourceName]: dataSource, [paginationName]: pagination } } = props;
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
      type: 'nameplatePrinting/updateState',
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
          delete saveData.nameplateHeaderId;
        }
        delete saveData.$form;
        dispatch({
          type: 'nameplatePrinting/saveHeaderList',
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
        saveData = { ...record, ...value, nameplateHeaderId: selectedRows[0].nameplateHeaderId };
        if (record._status === 'create') {
          delete saveData.nameplateLineId;
        }
        delete saveData.$form;
        dispatch({
          type: 'nameplatePrinting/saveLineList',
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
      type: 'nameplatePrinting/fetchHistoryList',
      payload: {
        page: isEmpty(page) ? {} : page,
        nameplateHeaderId: selectedRows[0].nameplateHeaderId,
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
    nameplatePrinting: {
      headList = [],
      headPagination = {},
      lineList = [],
      linePagination = {},
      historyPagination = {},
      historyList = [],
      typeList = [],
    },
  } = props;

  const rowSelection = {
    type: 'radio',
    selectedRowKeys: (selectedRows || []).map(e => e.nameplateHeaderId),
    onChange: handleChangeSelectedRows,
  };
  const filterProps = {
    tenantId,
    typeList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };

  const listTableProps = {
    typeList,
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
    tenantId,
    canEdit: !isEmpty(selectedRows) && selectedRows[0]._status !== 'create',
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
      <Header title="铭牌打印内部识别码对应关系维护">
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

export default connect(({ nameplatePrinting, loading }) => ({
  nameplatePrinting,
  fetchListLoading: loading.effects['nameplatePrinting/fetchList'],
  fetchLineListLoading: loading.effects['nameplatePrinting/fetchLineList'],
  saveHeaderListLoading: loading.effects['nameplatePrinting/saveHeaderList'],
  saveLineListLoading: loading.effects['nameplatePrinting/saveLineList'],
  fetchHistoryListLoading: loading.effects['nameplatePrinting/fetchHistoryList'],
  tenantId: getCurrentOrganizationId(),
}))(NameplatePrinting);
