/**
 * 采购接收过账
 * @date: 2020/06/17 20:41:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined, isEmpty, isArray } from 'lodash';
import uuid from 'uuid/v4';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import {
  filterNullValueObject,
  getCurrentOrganizationId,
  getCurrentUserId,
  getDateTimeFormat,
  addItemToPagination,
  delItemToPagination,
  delItemsToPagination,
  getEditTableData,
} from 'utils/utils';
import notification from 'utils/notification';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import ItemModal from './ItemModal';
import styles from './index.less';

const modelPrompt = 'tarzan.hmes.stockTakePlatform';
const dateTimeFormat = getDateTimeFormat();

@connect(({ stockTakePlatform, loading }) => ({
  stockTakePlatform,
  fetchListLoading: loading.effects['stockTakePlatform/fetchList'],
  fetchRangeListLoading: loading.effects['stockTakePlatform/fetchRangeList'],
  closeStockTakeDocLoading: loading.effects['stockTakePlatform/closeStockTakeDoc'],
  completeStockTakeDocLoading: loading.effects['stockTakePlatform/completeStockTakeDoc'],
  releaseStockTakeDocLoading: loading.effects['stockTakePlatform/releaseStockTakeDoc'],
  deleteRangeListLoading: loading.effects['stockTakePlatform/deleteRangeList'],
  fetchBatchItemListLoading: loading.effects['stockTakePlatform/fetchBatchItemList'],
  fetchBatchLocatorListLoading: loading.effects['stockTakePlatform/fetchBatchLocatorList'],
  saveRangeListLoading: loading.effects['stockTakePlatform/saveRangeList'],
  saveDocLoading: loading.effects['stockTakePlatform/saveDoc'],
  updateDocLoading: loading.effects['stockTakePlatform/updateDoc'],
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.stockTakePlatform',
})
export default class StockTakePlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRows: [],
      record: {}, // 当前打开范围弹框的盘点单
      rangeObjectType: undefined, // 打开弹框类型
    };
  }

  async componentDidMount() {
    const { dispatch, location: { state: { _back } = {} } } = this.props;
    await dispatch({
      type: 'stockTakePlatform/init',
    });
    await dispatch({
      type: 'stockTakePlatform/fetchLocatorTypeList',
    });
    if (_back !== -1) {
      await this.handleFetchList();
    }
  }


  /**
   * 查询盘点单列表
   *
   * @param {*} [page={}]
   * @memberof StockTakePlatform
   */
  @Bind()
  handleFetchList(page = {}) {
    const { dispatch } = this.props;
    this.setState({ selectedRows: [] });
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { creationDateFrom, creationDateTo } = value;
    value = {
      ...value,
      stocktakeStatus: isArray(value.stocktakeStatus) ? value.stocktakeStatus.join(',') : '',
      creationDateFrom: isEmpty(creationDateFrom)
        ? null
        : creationDateFrom.startOf('day').format(dateTimeFormat),
      creationDateTo: isEmpty(creationDateTo) ? null : creationDateTo.endOf('day').format(dateTimeFormat),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'stockTakePlatform/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }


  /**
   * 新建行
   *
   * @param {*} listName
   * @param {*} paginationName
   * @param {*} idName
   * @memberof StockTakePlatform
   */
  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, stockTakePlatform } = this.props;
    const dataSource = stockTakePlatform[listName];
    const pagination = stockTakePlatform[paginationName];
    if (listName === 'list' && dataSource.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      notification.warning({
        description: '当前存在未保存的数据，请先保存再新建盘点单据',
      });
    } else {
      const payload = listName === 'list' ? {
        materialRangeList: [],
        locatorRangeList: [],
      } : {};
      dispatch({
        type: 'stockTakePlatform/updateState',
        payload: {
          [listName]: [
            {
              ...payload,
              [idName]: uuid(),
              _status: 'create',
            },
            ...dataSource,
          ],
          [pagination]: addItemToPagination(dataSource.length, pagination),
        },
      });
    }
  }

  /**
  * 编辑当前行
  *
  * @param {string} dataSource 数据源在model里的名称
  * @param {string} id 数据源的id名称
  * @param {object} current 当前行
  * @param {boolean} flag
  * @memberof StockTakePlatform
  */
  @Bind()
  handleEditLine(listName, id, current, flag) {
    const { dispatch, stockTakePlatform } = this.props;
    const list = stockTakePlatform[listName];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'stockTakePlatform/updateState',
      payload: {
        [listName]: newList,
      },
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof StockTakePlatform
   */
  @Bind()
  handleCleanLine(listName, paginationName, id, current) {
    const { dispatch, stockTakePlatform } = this.props;
    const list = stockTakePlatform[listName];
    const pagination = stockTakePlatform[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    dispatch({
      type: 'stockTakePlatform/updateState',
      payload: {
        [listName]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      },
    });
  }


  @Bind()
  handleDelete(selectedRows) {
    const { dispatch, stockTakePlatform: { rangeList, rangePagination } } = this.props;
    const { record, rangeObjectType } = this.state;
    const originData = selectedRows.filter(e => e._status !== 'create');
    const selectedIds = selectedRows.map(e => e.id);
    const restData = rangeList.filter(e => !selectedIds.includes(e.id));
    if (originData.length > 0) {
      dispatch({
        type: `stockTakePlatform/deleteRangeList`,
        payload: {
          rangeList: originData,
          stocktakeId: record.stocktakeId,
          rangeObjectType,
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'stockTakePlatform/updateState',
            payload: {
              rangeList: restData,
              rangePagination: delItemsToPagination(selectedRows.length, rangeList.length, rangePagination),
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'stockTakePlatform/updateState',
        payload: {
          rangeList: restData,
          rangePagination: delItemsToPagination(selectedRows.length, rangeList.length, rangePagination),
        },
      });
    }
  }


  /**
   * 保存当前行的盘点单信息
   *
   * @param {*} record
   * @memberof StockTakePlatform
   */
  @Bind()
  handleSaveCurrentLine(record) {
    const { dispatch } = this.props;
    record.$form.validateFields((err, value) => {
      if (!err) {
        const { _status, stocktakeId, $form, materialRangeList, locatorRangeList, ...params } = record;
        const effectsName = _status === 'create' ? 'saveDoc' : 'updateDoc';
        dispatch({
          type: `stockTakePlatform/${effectsName}`,
          payload: _status === 'create' ? {
            ...params,
            ...value,
            openFlag: value.openFlag ? 'Y' : 'N',
            locatorIdList: locatorRangeList.map(e => e.rangeObjectId),
            materialIdList: materialRangeList.map(e => e.rangeObjectId),
          } : {
            ...params,
            stocktakeId,
            ...value,
            // openFlag: value.openFlag ? 'Y' : 'N',
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleFetchList();
          }
        });
      }
    });
  }


  /**
   * 当前盘点单下的物料范围列表
   *
   * @param {*} record
   * @param {*} page
   * @memberof StockTakePlatform
   */
  @Bind()
  handleFetchRangeList(params, page) {
    const { dispatch } = this.props;
    const value = this.drawerForm ? this.drawerForm.getFieldsValue() : {};
    dispatch({
      type: 'stockTakePlatform/fetchRangeList',
      payload: {
        page,
        ...value,
        ...params,
      },
    });
  }


  /**
   * 打开货位范围弹框 / 物料范围弹框
   *
   * @param {*} type
   * @param {*} record
   * @memberof StockTakePlatform
   */
  @Bind()
  handleOpenModal(record, rangeObjectType) {
    const { dispatch } = this.props;
    this.setState({ visible: true, rangeObjectType, record });
    if (record._status !== 'create') {
      this.handleFetchRangeList({ stocktakeId: record.stocktakeId, rangeObjectType });
      dispatch({
        type: 'stockTakePlatform/updateState',
        payload: {
          recordStatus: record.stocktakeStatusMeaning,
        },
      });
    } else {
      dispatch({
        type: 'stockTakePlatform/updateState',
        payload: {
          rangeList: rangeObjectType === 'MATERIAL' ? record.materialRangeList : record.locatorRangeList,
          recordStatus: '',
        },
      });
    }
  }



  /**
   * 关闭货位范围弹框 / 物料范围弹框
   *
   * @param {*} type
   * @memberof StockTakePlatform
   */
  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'stockTakePlatform/updateState',
      payload: {
        rangeList: [],
        rangePagination: {},
      },
    });
    this.setState({ visible: false, rangeObjectType: undefined });
  }


  /**
   * 根据物料类型批量带出物料范围
   *
   * @param {*} type
   * @memberof StockTakePlatform
   */
  @Bind()
  handleFetchBatchItemList(info = {}) {
    const { dispatch, stockTakePlatform: { rangeList, rangePagination } } = this.props;
    const { record } = this.state;
    dispatch({
      type: 'stockTakePlatform/fetchBatchItemList',
      payload: {
        ...info,
        rangeList,
        rangePagination,
        warehouseId: record._status === 'create' ? record.$form.getFieldValue('areaLocatorId') : record.areaLocatorId,
      },
    });
  }



  /**
   * 根据货位类型批量带入货位范围
   *
   * @param {*} type
   * @memberof StockTakePlatform
   */
  @Bind()
  handleFetchBatchLocatorList(locatorType) {
    const { dispatch, stockTakePlatform: { rangeList, rangePagination } } = this.props;
    const { record } = this.state;
    dispatch({
      type: 'stockTakePlatform/fetchBatchLocatorList',
      payload: {
        locatorType,
        rangeList,
        rangePagination,
        warehouseId: record._status === 'create' ? record.$form.getFieldValue('areaLocatorId') : record.areaLocatorId,
      },
    });
  }


  /**
   * 保存盘点单下的物料范围
   *
   * @memberof StockTakePlatform
   */
  @Bind()
  handleSaveRangeList() {
    const { dispatch, stockTakePlatform: { rangeList, list } } = this.props;
    const { record, rangeObjectType } = this.state;
    const newItemList = getEditTableData(rangeList).map(e => ({
      ...e,
      stocktakeId: record.stocktakeId,
      rangeObjectType,
    }));
    if (newItemList.length > 0) {
      if (record._status === 'create') {
        const rangeListName = rangeObjectType === 'MATERIAL' ? 'materialRangeList' : 'locatorRangeList';
        const newList = list.map(e => e.stocktakeId === record.stocktakeId ? {
          ...e,
          [rangeListName]: newItemList,
        } : e);
        dispatch({
          type: 'stockTakePlatform/updateState',
          payload: {
            list: newList,
          },
        });
        this.setState({ visible: false, rangeObjectType: undefined });
      } else {
        const newRangeList = newItemList.map(e => {
          const { id, ...obj } = e;
          return obj;
        });
        dispatch({
          type: 'stockTakePlatform/saveRangeList',
          payload: {
            rangeList: newRangeList,
            stocktakeId: record.stocktakeId,
            rangeObjectType,
          },
        }).then(res => {
          if (res) {
            notification.success();
            this.handleFetchRangeList({ stocktakeId: record.stocktakeId, rangeObjectType });
          }
        });
      }
    }
  }

  @Bind()
  handleToMaterialDetail() {
    const { selectedRows } = this.state;
    const stocktakeIds = selectedRows.map(e => e.stocktakeId).join('-');
    const areaLocatorId = selectedRows.map(e => e.areaLocatorId).toString();
    const { history } = this.props;
    history.push({
      pathname: `/hwms/stock-take-platform/material-detail/${stocktakeIds}`,
      query: { areaLocatorId },
    });
  }

  @Bind()
  handleToBarcodeDetail() {
    const { selectedRows } = this.state;
    const stocktakeIds = selectedRows.map(e => e.stocktakeId).join('-');
    const areaLocatorId = selectedRows.map(e => e.areaLocatorId).toString();
    const { history } = this.props;
    history.push({
      pathname: `/hwms/stock-take-platform/barcode-detail/${stocktakeIds}`,
      query: { areaLocatorId },
    });
    // history.push(`/hwms/stock-take-platform/barcode-detail/${stocktakeIds}`);
  }

  @Bind()
  handleCloseStockTakeDoc() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      notification.warning({ description: '当前勾选项有未保存的盘点单，请先保存再关闭' });
    } else if (selectedRows.every(e => e.stocktakeStatus === 'NEW')) {
      dispatch({
        type: 'stockTakePlatform/closeStockTakeDoc',
        payload: selectedRows.map(e => e.stocktakeId),
      }).then(res => {
        if (res && res.failed) {
          notification.warning({ description: res.message });
        } else {
          notification.success();
          this.handleFetchList();
        }
      });
    } else {
      Modal.confirm({
        title: '存在盘点单已下达并冻结对应盘点范围库存，是否关闭盘点单并解除冻结库存',
        onOk: () => {
          dispatch({
            type: 'stockTakePlatform/closeStockTakeDoc',
            payload: selectedRows.map(e => e.stocktakeId),
          }).then(res => {
            if (res && res.failed) {
              notification.warning({ description: res.message });
            } else {
              notification.success();
              this.handleFetchList();
            }
          });
        },
      });
    }
  }

  @Bind()
  handleFetchIsLeak() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      notification.warning({ description: '当前勾选项有未保存的盘点单，请先保存再完成' });
    } else {
      dispatch({
        type: 'stockTakePlatform/fetchIsLeak',
        payload: selectedRows.map(e => e.stocktakeId),
      }).then(res => {
        if (res && res.failed) {
          notification.warning({ description: res.message });
        } else if (isArray(res) && !isEmpty(res)) {
          Modal.confirm({
            title: `当前盘点单${res.join('/ ')}还存在初盘漏盘项，是否确认完成？`,
            onOk: () => this.handleCompleteStockTakeDoc(),
          });
        } else {
          notification.success();
          this.handleCompleteStockTakeDoc();
        }
      });
    }
  }

  @Bind()
  handleCompleteStockTakeDoc() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'stockTakePlatform/completeStockTakeDoc',
      payload: selectedRows.map(e => e.stocktakeId),
    }).then(res => {
      if (res && res.failed) {
        notification.warning({ description: res.message });
      } else {
        notification.success();
        this.handleFetchList();
      }
    });
  }

  @Bind()
  handleReleaseStockTakeDoc() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.filter(e => ['create', 'update'].includes(e._status)).length > 0) {
      notification.warning({ description: '当前勾选项有未保存的盘点单，请先保存再完成' });
    } else {
      dispatch({
        type: 'stockTakePlatform/releaseStockTakeDoc',
        payload: selectedRows.map(e => e.stocktakeId),
      }).then(res => {
        if (res && res.failed) {
          notification.warning({ description: res.message });
        } else {
          notification.success();
          this.handleFetchList();
        }
      });
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handleCleanRangeList(record) {
    const { dispatch, stockTakePlatform: { list } } = this.props;
    const newList = list.map(e => record.stocktakeId === e.stocktakeId ? { ...e, materialRangeList: [], locatorRangeList: [] } : e);
    dispatch({
      type: 'stockTakePlatform/updateState',
      payload: {
        list: newList,
        rangeList: [],
        rangePagination: {},
      },
    });
  }


  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      userId,
      fetchRangeListLoading,
      closeStockTakeDocLoading,
      completeStockTakeDocLoading,
      releaseStockTakeDocLoading,
      deleteRangeListLoading,
      fetchBatchItemListLoading,
      saveRangeListLoading,
      saveDocLoading,
      updateDocLoading,
      fetchBatchLocatorListLoading,
      stockTakePlatform: {
        list = [],
        pagination = {},
        docStatusList = [],
        siteInfo,
        rangeList = [],
        rangePagination = {},
        locatorTypeList,
        recordStatus,
      },
    } = this.props;
    const { selectedRows, visible, record, rangeObjectType } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.stocktakeId),
      onChange: this.handleChangeSelectRows,
    };
    const filterProps = {
      tenantId,
      dataSource: list,
      docStatusList,
      siteInfo,
      userId,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleFetchList,
    };
    const listProps = {
      tenantId,
      userId,
      loading: fetchListLoading || saveDocLoading || updateDocLoading || closeStockTakeDocLoading || completeStockTakeDocLoading || releaseStockTakeDocLoading,
      pagination,
      rowSelection,
      siteInfo,
      dataSource: list,
      onOpenModal: this.handleOpenModal,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchList,
      onSave: this.handleSaveCurrentLine,
      onCleanRangeList: this.handleCleanRangeList,
    };
    const itemModalProps = {
      currentRecord: record,
      rangeObjectType,
      visible,
      siteInfo,
      tenantId,
      locatorTypeList,
      dataSource: rangeList,
      pagination: rangePagination,
      loading: fetchRangeListLoading || fetchBatchItemListLoading || fetchBatchLocatorListLoading,
      deleteLoading: deleteRangeListLoading,
      saving: saveRangeListLoading,
      onSearch: this.handleFetchRangeList,
      onCreate: this.handleCreate,
      onCleanLine: this.handleCleanLine,
      onSave: this.handleSaveRangeList,
      onDelete: this.handleDelete,
      onCancel: this.handleCloseModal,
      onFetchBatchItemList: this.handleFetchBatchItemList,
      onFetchBatchLocatorList: this.handleFetchBatchLocatorList,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
      recordStatus,
    };

    return (
      <React.Fragment>
        <Header title={intl.get(`${modelPrompt}.view.title`).d('盘点平台')}>
          <Button
            type="default"
            onClick={() => this.handleToMaterialDetail()}
            disabled={selectedRows.length === 0}
          >
            盘点明细
          </Button>
          <Button
            type="default"
            onClick={() => this.handleToBarcodeDetail()}
            disabled={selectedRows.length === 0}
          >
            条码明细
          </Button>
          <Button
            type="default"
            onClick={() => this.handleCloseStockTakeDoc()}
            loading={closeStockTakeDocLoading}
            disabled={(!selectedRows.every(e => ['NEW', 'RELEASED'].includes(e.stocktakeStatus)) || isEmpty(selectedRows)) || completeStockTakeDocLoading || releaseStockTakeDocLoading || fetchListLoading}
          >
            关闭
          </Button>
          <Button
            type="default"
            onClick={() => this.handleFetchIsLeak()}
            loading={completeStockTakeDocLoading}
            disabled={(!selectedRows.every(e => ['RELEASED'].includes(e.stocktakeStatus)) || isEmpty(selectedRows)) || closeStockTakeDocLoading || releaseStockTakeDocLoading || fetchListLoading}
          >
            完成
          </Button>
          <Button
            type="default"
            onClick={() => this.handleReleaseStockTakeDoc()}
            loading={releaseStockTakeDocLoading}
            disabled={(!selectedRows.every(e => e.stocktakeStatus === 'NEW') || isEmpty(selectedRows)) || closeStockTakeDocLoading || completeStockTakeDocLoading || fetchListLoading}
          >
            下达
          </Button>
          <Button
            type="primary"
            onClick={() => this.handleCreate('list', 'pagination', 'stocktakeId')}
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
        <ItemModal {...itemModalProps} />
      </React.Fragment>
    );
  }
}
