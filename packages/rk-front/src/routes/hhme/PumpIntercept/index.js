/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Button } from 'hzero-ui';
import { isUndefined, isEmpty } from 'lodash';
import uuid from 'uuid/v4';

import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getCurrentUserId,
  getDateTimeFormat,
  addItemToPagination,
  delItemToPagination,
  addItemsToPagination,
  getEditTableData,
} from 'utils/utils';
import notification from 'utils/notification';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import ProcessListModal from './ProcessListModal';
import ObjectListModal from './ObjectListModal';
import SnListModal from './SnListModal';
import DetailModal from './DetailModal';

import styles from './index.less';

const modelPrompt = 'tarzan.hmes.pumpIntercept';
const dateTimeFormat = getDateTimeFormat();

const PumpIntercept = (props) => {
  const [processVisible, setProcessVisible] = useState(false);
  const [objectVisible, setObjectVisible] = useState(false);
  const [snVisible, setSnVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [record, setRecord] = useState({});
  const filterRef = useRef();

  useEffect(() => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/init',
    });
  }, []);

  /**
   * 查询列表
   *
   * @param {*} [page={}]
   * @memberof StockTakePlatform
   */
  const handleSearch = (page = {}) => {
    const { dispatch } = props;
    setSelectedRows([]);
    let value = isUndefined(filterRef.current) ? {} : filterRef.current.formFields;
    const { interceptDateFrom, interceptDateTo } = value;
    value = filterNullValueObject({
      ...value,
      interceptDateFrom: isEmpty(interceptDateFrom) ? null : interceptDateFrom.startOf('day').format(dateTimeFormat),
      interceptDateTo: isEmpty(interceptDateTo) ? null : interceptDateTo.endOf('day').format(dateTimeFormat),
    });
    dispatch({
      type: 'pumpIntercept/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...value,
      },
    });
  };


  /**
   * 新建行
   *
   * @param {*} listName
   * @param {*} paginationName
   * @param {*} idName
   * @memberof StockTakePlatform
   */
  const handleCreate = (listName, paginationName, idName) => {
    const { dispatch, pumpIntercept } = props;
    const dataSource = pumpIntercept[listName];
    const pagination = pumpIntercept[paginationName];
    if (listName === 'list' && dataSource.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      notification.warning({
        description: '当前存在未保存的数据，请先保存再新建盘点单据',
      });
    } else {
      dispatch({
        type: 'pumpIntercept/updateState',
        payload: {
          [listName]: [
            {
              [idName]: uuid(),
              _status: 'create',
            },
            ...dataSource,
          ],
          [pagination]: addItemToPagination(dataSource.length, pagination),
        },
      });
    }
  };

  /**
  * 编辑当前行
  *
  * @param {string} dataSource 数据源在model里的名称
  * @param {string} id 数据源的id名称
  * @param {object} current 当前行
  * @param {boolean} flag
  * @memberof StockTakePlatform
  */
  const handleEditLine = (listName, id, current, flag) => {
    const { dispatch, pumpIntercept } = props;
    const list = pumpIntercept[listName];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'pumpIntercept/updateState',
      payload: {
        [listName]: newList,
      },
    });
  };

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof StockTakePlatform
   */
  const handleCleanLine = (listName, paginationName, id, current) => {
    const { dispatch, pumpIntercept } = props;
    const list = pumpIntercept[listName];
    const pagination = pumpIntercept[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'pumpIntercept/updateState',
      payload: {
        [listName]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      },
    });
  };

  /**
   * 保存当前行的拦截单信息
   *
   * @param {*} record
   * @memberof StockTakePlatform
   */
  const handleSaveCurrentLine = (recordData) => {
    const { dispatch } = props;
    recordData.$form.validateFields((err, value) => {
      if (!err) {
        const { _status, interceptId, $form, ...params } = recordData;
        dispatch({
          type: `pumpIntercept/saveCurrentData`,
          payload: _status === 'create' ? {
            ...params,
            ...value,
          } : {
            ...params,
            interceptId,
            ...value,
          },
        }).then(res => {
          if (res) {
            notification.success();
            handleSearch();
          }
        });
      }
    });
  };


  /**
   * 打开货位范围弹框 / 物料范围弹框
   *
   * @param {*} type
   * @param {*} record
   * @memberof StockTakePlatform
   */
  const handleOpenModal = (recordData, modalType) => {
    setRecord(recordData);
    switch (modalType) {
      case 'PROCESS':
        setProcessVisible(true);
        if (record._status !== 'create') {
          handleFetchProcessList({}, recordData.interceptId);
        }
        break;
      case 'OBJECT':
        setObjectVisible(true);
        if (record._status !== 'create') {
          handleFetchObjectList({}, recordData.interceptId);
        }
        break;
      case 'SN':
        setSnVisible(true);
        if (record._status !== 'create') {
          handleFetchSnList({}, recordData.interceptId);
        }
        break;
      default:
        break;
    }
  };

  const handleFetchProcessList = (page = {}, interceptId) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/fetchProcessList',
      payload: {
        interceptId,
        page,
      },
    });
  };

  const handleFetchObjectList = (page = {}, interceptId) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/fetchObjectList',
      payload: {
        interceptId,
        page,
      },
    });
  };

  const handleFetchSnList = (page, interceptId) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/fetchSnList',
      payload: {
        interceptId,
        page,
      },
    });
  };

  const handleChangeSelectRows = (selectedRowKeys, selectRows) => {
    setSelectedRows(selectRows);
  };

  const handleUpdateLineList = (dataList, dataListName, paginationName) => {
    const { dispatch, pumpIntercept: { [dataListName]: dataSource, [paginationName]: pagination } } = props;
    dispatch({
      type: 'pumpIntercept/updateState',
      payload: {
        [dataListName]: isEmpty(dataList) ? [] : dataList,
        [paginationName]: isEmpty(dataList) ? {} : addItemsToPagination(dataList.length - dataSource.length, dataSource.length, pagination),
      },
    });
  };

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */

  const validateEditTable = (dataSource = [], excludeKeys = [], property = {}, dataListName) => {
    const editTableData = dataSource.filter(e => e._status);
    if ((dataListName === 'object' && editTableData.length === 0) || (dataListName === 'processList' && !isEmpty(processList)) || (dataListName === 'snList' && !isEmpty(snList))) {
      return Promise.resolve(editTableData);
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  };

  const handleSaveLineList = (dataListName) => {
    const { dispatch, pumpIntercept: { [dataListName]: dataSource } } = props;
    let effects = '';
    const newDataSource = dataSource.filter(e => e._status === 'create');
    if (newDataSource.length > 0) {
      let idName = '';
      switch (dataListName) {
        case 'processList':
          effects = 'saveProcessList';
          idName = 'interceptWorkcellId';
          break;
        case 'objectList':
          effects = 'saveObjectList';
          idName = 'interceptObjectId';
          break;
        case 'snList':
          effects = 'saveSnList';
          idName = 'materialLotId';
          break;
        default:
          break;
      }
      Promise.all([
        validateEditTable(newDataSource, idName, {}, dataListName),
      ]).then(result => {
        if (result) {
          const [list] = result;
          dispatch({
            type: `pumpIntercept/${effects}`,
            payload: {
              list,
              interceptId: record.interceptId,
            },
          }).then(res => {
            if (res) {
              notification.success();
              switch (dataListName) {
                case 'processList':
                  handleFetchProcessList({}, record.interceptId);
                  break;
                case 'objectList':
                  handleFetchObjectList({}, record.interceptId);
                  break;
                case 'snList':
                  handleFetchSnList({}, record.interceptId);
                  break;
                default:
                  break;
              }
            }
          });
        }
      });
    } else {
      notification.warning({ description: '当前没有新增数据，请重新选择' });
    }


  };

  const handlePassProcessList = (dataList) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/passProcessList',
      payload: {
        list: dataList,
        interceptId: record.interceptId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        handleFetchProcessList({}, record.interceptId);
      }
    });
  };

  const handlePassObjectList = (dataList) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/passObjectList',
      payload: {
        list: dataList,
        interceptId: record.interceptId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        handleFetchObjectList({}, record.interceptId);
      }
    });
  };

  const handleOpenDetailModal = (recordData) => {
    setRecord(recordData);
    setDetailVisible(true);
    handleFetchDetailList({}, recordData.interceptId);
  };

  const handleFetchDetailList = (page = {}, interceptId) => {
    const { dispatch } = props;
    dispatch({
      type: 'pumpIntercept/fetchDetailList',
      payload: {
        page,
        interceptId,
      },
    });
  };

  const handleCloseDetailModal = () => {
    setDetailVisible(false);
  };


  const {
    fetchListLoading,
    tenantId,
    fetchDetailListLoading,
    saveCurrentDataLoading,
    fetchObjectListLoading,
    saveObjectListLoading,
    fetchProcessListLoading,
    saveProcessListLoading,
    fetchSnListLoading,
    saveSnListLoading,
    pumpIntercept: {
      list = [],
      pagination = {},
      processList = [],
      processPagination = {},
      dimensionList = [],
      statusList = [],
      objectList = [],
      objectPagination = {},
      snList = [],
      snPagination = {},
      detailList = [],
      detailPagination = {},
      detailInfo,
    },
  } = props;
  const rowSelection = {
    selectedRowKeys: selectedRows.map(e => e.interceptId),
    onChange: handleChangeSelectRows,
  };
  const filterProps = {
    tenantId,
    dimensionList,
    statusList,
    wrappedComponentRef: filterRef,
    onSearch: handleSearch,
  };
  const listProps = {
    dimensionList,
    loading: fetchListLoading || saveCurrentDataLoading,
    pagination,
    rowSelection,
    dataSource: list,
    saving: saveCurrentDataLoading,
    onOpenModal: handleOpenModal,
    onEditLine: handleEditLine,
    onCleanLine: handleCleanLine,
    onSearch: handleSearch,
    onSave: handleSaveCurrentLine,
    onOpenDetailModal: handleOpenDetailModal,
  };

  const processListModalProps = {
    tenantId,
    currentRecord: record,
    dataSource: processList,
    pagination: processPagination,
    visible: processVisible,
    saving: saveProcessListLoading,
    loading: fetchProcessListLoading,
    onSetVisible: setProcessVisible,
    onUpdateLineList: handleUpdateLineList,
    onSave: handleSaveLineList,
    onPass: handlePassProcessList,
    onSearch: handleFetchSnList,
  };

  const objectListModalProps = {
    tenantId,
    currentRecord: record,
    dataSource: objectList,
    pagination: objectPagination,
    visible: objectVisible,
    loading: fetchObjectListLoading,
    onSetVisible: setObjectVisible,
    onUpdateLineList: handleUpdateLineList,
    onSave: handleSaveLineList,
    onPass: handlePassObjectList,
    onSearch: handleFetchObjectList,
  };

  const snListModalProps = {
    currentRecord: record,
    dataSource: snList,
    pagination: snPagination,
    visible: snVisible,
    loading: fetchSnListLoading,
    saving: saveSnListLoading,
    onSetVisible: setSnVisible,
    onUpdateLineList: handleUpdateLineList,
    onSave: handleSaveLineList,
    onSearch: handleFetchSnList,
  };

  const detailModalProps = {
    detailInfo,
    tenantId,
    currentRecord: record,
    interceptId: record.interceptId,
    visible: detailVisible,
    dataSource: detailList,
    pagination: detailPagination,
    onSearch: handleFetchDetailList,
    onCancel: handleCloseDetailModal,
    loading: fetchDetailListLoading,
    saving: saveObjectListLoading,
  };

  return (
    <React.Fragment>
      <Header title={intl.get(`${modelPrompt}.view.title`).d('泵浦源拦截管理')}>
        <Button
          type="primary"
          onClick={() => handleCreate('list', 'pagination', 'interceptId')}
        >
          新建
        </Button>
      </Header>
      <Content>
        <FilterForm {...filterProps} />
        <div className={styles['head-table']}>
          <ListTable {...listProps} />
        </div>
      </Content>
      <ProcessListModal {...processListModalProps} />
      <ObjectListModal {...objectListModalProps} />
      <SnListModal {...snListModalProps} />
      <DetailModal {...detailModalProps} />
      <ModalContainer ref={registerContainer} />
    </React.Fragment>
  );
};

export default connect(({ pumpIntercept, loading }) => ({
  pumpIntercept,
  fetchListLoading: loading.effects['pumpIntercept/fetchList'],
  fetchDetailListLoading: loading.effects['pumpIntercept/fetchDetailList'],
  saveCurrentDataLoading: loading.effects['pumpIntercept/saveCurrentData'],
  fetchObjectListLoading: loading.effects['pumpIntercept/fetchObjectList'],
  saveObjectListLoading: loading.effects['pumpIntercept/saveObjectList'],
  fetchProcessListLoading: loading.effects['pumpIntercept/fetchProcessList'],
  saveProcessListLoading: loading.effects['pumpIntercept/saveProcessList'],
  fetchSnListLoading: loading.effects['pumpIntercept/fetchSnList'],
  saveSnListLoading: loading.effects['pumpIntercept/saveSnList'],
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
}))(PumpIntercept);