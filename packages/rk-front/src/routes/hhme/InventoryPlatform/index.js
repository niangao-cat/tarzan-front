/**
 * 异常信息维护 - AbnormalInfo
 * @date: 2020/05/09 10:12:38
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import uuid from 'uuid/v4';
import { isUndefined, isEmpty, isArray } from 'lodash';

import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import notification from 'utils/notification';
import {
  getEditTableData,
  addItemToPagination,
  delItemToPagination,
  filterNullValueObject,
  getCurrentOrganizationId,
  delItemsToPagination,
  getDateTimeFormat,
} from 'utils/utils';

import FilterForm from './FilterForm';
import ListTable from './ListTable';
import MaterialRangeDrawer from './MaterialRangeDrawer';
import styles from './index.less';


@connect(({ inventoryPlatform, loading }) => ({
  inventoryPlatform,
  fetchListLoading: loading.effects['inventoryPlatform/fetchList'],
  fetchRangeListLoading: loading.effects['inventoryPlatform/fetchRangeList'],
  fetchBatchMaterialListLoading: loading.effects['inventoryPlatform/fetchBatchMaterialList'],
  fetchBatchProdLineListLoading: loading.effects['inventoryPlatform/fetchBatchProdLineList'],
  fetchBatchWorkcellListLoading: loading.effects['inventoryPlatform/fetchBatchWorkcellList'],
  saveHeadListLoading: loading.effects['inventoryPlatform/saveHeadList'],
  updateHeadListLoading: loading.effects['inventoryPlatform/updateHeadList'],
  closeValidateLoading: loading.effects['inventoryPlatform/closeValidate'],
  closeLoading: loading.effects['inventoryPlatform/close'],
  completeValidateLoading: loading.effects['inventoryPlatform/completeValidate'],
  completeLoading: loading.effects['inventoryPlatform/complete'],
  releaseLoading: loading.effects['inventoryPlatform/release'],
  saveRangeListLoading: loading.effects['inventoryPlatform/saveRangeList'],
  deleteRangeListLoading: loading.effects[`inventoryPlatform/deleteRangeList`],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.inventoryPlatform',
})
export default class InventoryPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentRecord: {},
      rangeObjectType: '', // MATERIAL | PL | WP
      selectedRows: [],
      prodLineDel: false,
    };
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        currentRecord: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({
      type: 'inventoryPlatform/init',
    });
    await this.handleSearch();
  }

  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    let value = this.formDom ? this.formDom.getFieldsValue() : {};
    const { createdDateFrom, createdDateTo } = value;
    value = {
      ...value,
      stocktakeStatus: isArray(value.stocktakeStatus) ? value.stocktakeStatus.join(',') : '',
      createdDateFrom: isEmpty(createdDateFrom)
        ? null : createdDateFrom.format(getDateTimeFormat()),
      createdDateTo: isEmpty(createdDateTo) ? null : createdDateTo.format(getDateTimeFormat()),
    };
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'inventoryPlatform/fetchList',
      payload: {
        page: isEmpty(page) ? {} : page,
        ...filterValue,
      },
    });
  }

  @Bind()
  handleCreate(listName, paginationName, idName) {
    const { dispatch, inventoryPlatform } = this.props;
    const dataSource = inventoryPlatform[listName];
    const pagination = inventoryPlatform[paginationName];
    dispatch({
      type: 'inventoryPlatform/updateState',
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

  /**
   * 编辑当前行
   *
   * @param {string} dataSource 数据源在model里的名称
   * @param {string} id 数据源的id名称
   * @param {object} current 当前行
   * @param {boolean} flag
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleEditLine(dataSource, id, current, flag) {
    const { dispatch, inventoryPlatform } = this.props;
    const list = inventoryPlatform[dataSource];
    const newList = list.map(item =>
      item[id] === current[id] ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        [dataSource]: newList,
      },
    });
  }

  /**
   * 清除当前行
   *
   * @param {string} dataSource
   * @param {string} id
   * @param {object} current
   * @memberof ContractBaseInfo
   */
  @Bind()
  handleCleanLine(dataSource, paginationName, id, current) {
    const { rangeObjectType } = this.state;
    const { dispatch, inventoryPlatform } = this.props;
    const list = inventoryPlatform[dataSource];
    const pagination = inventoryPlatform[paginationName];
    const newList = list.filter(item => item[id] !== current[id]);
    if (rangeObjectType=== 'PL') {
      this.setState({ prodLineDel: true });
    }
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        [dataSource]: newList,
        [paginationName]: delItemToPagination(pagination.length, pagination),
      },
    });
  }

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */
  @Bind()
  validateEditTable(dataSource = [], excludeKeys = [], property = {}) {
    const editTableData = dataSource.filter(e => e._status);
    if (editTableData.length === 0) {
      return Promise.resolve(dataSource);
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
  }

  @Bind()
  handleSaveHeadList(record) {
    const { dispatch, inventoryPlatform: { pagination } } = this.props;
    const { $form, stocktakeId, materialRangeList, prodLineRangeList, workcellRangeList, ...headLineInfo } = record;
    const effects = record._status === 'create' ? 'saveHeadList' : 'updateHeadList';
    record.$form.validateFields((err, value) => {
      if (!err) {
        const payload = {
          ...headLineInfo,
          ...value,
          materialIdList: isArray(materialRangeList) ? materialRangeList.map(e => e.rangeObjectId) : [],
          prodLineIdList: isArray(prodLineRangeList) ? prodLineRangeList.map(e => e.rangeObjectId) : [],
          workcellIdList: isArray(workcellRangeList) ? workcellRangeList.map(e => e.rangeObjectId) : [],
          openFlag: value.openFlag ? 'Y' : 'N',
        };
        const newPayload = record._status === 'create' ? payload : { ...payload, stocktakeId};
        dispatch({
          type: `inventoryPlatform/${effects}`,
          payload: newPayload,
        }).then(res => {
          if (res) {
            notification.success();
            this.handleSearch(pagination);
          }
        });
      }
    });
  }

  @Bind()
  handleSaveLineList() {
    const {
      dispatch,
      inventoryPlatform: { lineList = [], currentRecord },
    } = this.props;
    Promise.all([this.validateEditTable(lineList, ['exceptionRouterId'])]).then(res => {
      const [newLineList] = res;
      const newList = newLineList.map(e => ({
        ...e,
        exceptionId: currentRecord.exceptionId,
        isTop: e.isTop ? 'Y' : 'N',
      }));
      const noUpdateList = lineList.filter(e => !['create', 'update'].includes(e._status));
      const topList = noUpdateList.concat(newList).filter(e => e.isTop === 'Y');
      if (topList.length > 0) {
        dispatch({
          type: 'inventoryPlatform/saveLineList',
          payload: {
            data: newList,
          },
        }).then(result => {
          if (result) {
            notification.success();
            this.handleFetchLineList();
          }
        });
      } else {
        notification.warning({
          description: '保存时必须存在一行勾选【是否最高级异常】',
        });
      }
    });
  }

  @Bind()
  handleToInventoryDetail() {
    const { selectedRows } = this.state;
    const stocktakeIds = selectedRows.map(e => e.stocktakeId).join('-');
    const { history } = this.props;
    history.push(`/hhme/inventory-platform/detail/${stocktakeIds}`);
  }

  @Bind()
  handleToInventorySummary() {
    const { selectedRows } = this.state;
    const stocktakeIds = selectedRows.map(e => e.stocktakeId).join('-');
    const { history } = this.props;
    history.push(`/hhme/inventory-platform/summary/${stocktakeIds}`);
  }

  @Bind()
  handleToMaterialSummary() {
    const { selectedRows } = this.state;
    const stocktakeIds = selectedRows.map(e => e.stocktakeId).join('-');
    const { history } = this.props;
    history.push(`/hhme/inventory-platform/material-summary/${stocktakeIds}`);
  }

  @Bind()
  handleRelease() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const list = selectedRows.filter(e => ['NEW'].includes(e.stocktakeStatus));
    if(list.length > 0) {
      dispatch({
        type: 'inventoryPlatform/release',
        payload: {
          hmeWipStocktakeDocList: list,
        },
      }).then(res => {
        if(res) {
          this.handleSearch();
          notification.success();
          this.setState({ selectedRows: [] });
        }
      });
    } else {
      notification.warning({ description: '当前勾选项没有新建状态的单据'});
    }
  }

  @Bind()
  handleClose() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'inventoryPlatform/closeValidate',
      payload: {
        hmeWipStocktakeDocList: selectedRows,
      },
    }).then(res => {
      if(res && res.flag) {
        this.handleSearch();
        notification.success();
        this.setState({ selectedRows: [] });
      } else if(res && !res.flag) {
        Modal.confirm({
          title: '存在盘点单已下达并冻结对应盘点范围库存，是否关闭盘点单并解除冻结库存？',
          onOk: () => {
            dispatch({
              type: 'inventoryPlatform/close',
              payload: {
                hmeWipStocktakeDocList: selectedRows,
              },
            }).then(result => {
              if(result) {
                this.handleSearch();
                notification.success();
                this.setState({ selectedRows: [] });
              }
            });
          },
        });
      }
    });
  }

  @Bind()
  handleComplete() {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'inventoryPlatform/completeValidate',
      payload: {
        hmeWipStocktakeDocList: selectedRows,
      },
    }).then(res => {
      if(res && res.flag) {
        this.handleSearch();
        notification.success();
        this.setState({ selectedRows: [] });
      } else if(res && !res.flag) {
        Modal.confirm({
          title: '盘点单还存在初盘漏盘项，是否确认完成？',
          onOk: () => {
            dispatch({
              type: 'inventoryPlatform/complete',
              payload: {
                hmeWipStocktakeDocList: selectedRows,
              },
            }).then(result => {
              if(result) {
                this.handleSearch();
                notification.success();
                this.setState({ selectedRows: [] });
              }
            });
          },
        });
      }
    });
  }

  @Bind()
  handleCreateHeadList() {
    const { inventoryPlatform: { list = [] } } = this.props;
    const editList = list.filter(e => ['create', 'update'].includes(e._status));
    if(editList.length > 0) {
      notification.warning({ description: '当前有为保存的单据，请先保存再新建'});
    } else {
      this.handleCreate('list', 'pagination', 'stocktakeId');
    }
  }

  @Bind()
  handleCreateRangeList() {
    this.handleCreate('rangeList', 'rangePagination', 'id');
  }

  @Bind()
  handleGetRangeListName(rangeObjectType) {
    let rangeListName = '';
    switch(rangeObjectType) {
      case 'MATERIAL':
        rangeListName = 'materialRangeList';
        break;
      case 'PL':
        rangeListName = 'prodLineRangeList';
        break;
      case 'WP':
        rangeListName = 'workcellRangeList';
        break;
      default:
        break;
    }
    return rangeListName;
  }

  /**
   * 保存盘点单下的物料范围
   *
   * @memberof StockTakePlatform
   */
   @Bind()
   handleSaveRangeList() {
     const { dispatch, inventoryPlatform: { rangeList, list, pagination } } = this.props;
     const { currentRecord, rangeObjectType } = this.state;
     const newItemList = getEditTableData(rangeList).map(e => ({
       ...e,
       stocktakeId: currentRecord.stocktakeId,
       rangeObjectType,
     }));
     if(newItemList.length > 0) {
       if(currentRecord._status === 'create') {
         const rangeListName = this.handleGetRangeListName(rangeObjectType);
         const newList = list.map(e => e.stocktakeId === currentRecord.stocktakeId ? {
           ...e,
           [rangeListName]: newItemList,
         } : e);
         dispatch({
           type: 'inventoryPlatform/updateState',
           payload: {
             list: newList,
           },
         });
         this.setState({ visible: false, rangeObjectType: undefined });
         if (rangeObjectType=== 'WP') {
           this.setState({ prodLineDel: false });
         }
       } else {
         const newRangeList = newItemList.map(e => {
           const {id, ...obj} = e;
           return obj;
         });
         dispatch({
           type: 'inventoryPlatform/saveRangeList',
           payload: {
             addList: newRangeList,
             stocktakeId: currentRecord.stocktakeId,
             rangeObjectType,
           },
         }).then(res => {
           if(res) {
             notification.success();
             this.handleFetchRangeList({stocktakeId: currentRecord.stocktakeId, rangeObjectType});
             this.handleSearch(pagination);
           }
         });
       }
     }
   }

   @Bind()
   handleFetchRangeList(params, page) {
    const { dispatch } = this.props;
    const value = this.drawerForm ? this.drawerForm.getFieldsValue() : {};
    dispatch({
      type: 'inventoryPlatform/fetchRangeList',
      payload: {
        page,
        ...value,
        ...params,
      },
    });
   }

  @Bind()
  handleCloseModal() {
    const { rangeObjectType } = this.state;
    const { dispatch } = this.props;
    this.setState({ visible: false, currentRecord: {} });
    if (rangeObjectType=== 'WP') {
      this.setState({ prodLineDel: false });
    }
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        rangeList: [],
        rangePagination: {},
      },
    });
  }

  @Bind()
  handleOpenModal(currentRecord, rangeObjectType) {
    const { dispatch } = this.props;
    this.setState({ visible: true, currentRecord, rangeObjectType });
    if(currentRecord._status !== 'create') {
      this.handleFetchRangeList({stocktakeId: currentRecord.stocktakeId, rangeObjectType });
    } else {
      const rangeListName = this.handleGetRangeListName(rangeObjectType);
      dispatch({
        type: 'inventoryPlatform/updateState',
        payload: {
          rangeList: currentRecord[rangeListName],
        },
      });
    }
  }

  @Bind()
  handleDelete(selectedRows) {
    const { dispatch, inventoryPlatform: { rangeList, rangePagination, list } } = this.props;
    const { currentRecord, rangeObjectType } = this.state;
    const originData = selectedRows.filter(e => e._status !== 'create');
    const selectedIds = selectedRows.map(e => e.id);
    const restData = rangeList.filter(e => !selectedIds.includes(e.id));
    if(originData.length > 0) {
      dispatch({
        type: `inventoryPlatform/deleteRangeList`,
        payload: {
          deleteList: originData,
          stocktakeId: currentRecord.stocktakeId,
          rangeObjectType,
        },
      }).then(res => {
        if(res) {
          dispatch({
            type: 'inventoryPlatform/updateState',
            payload: {
              rangeList: restData,
              rangePagination: delItemsToPagination(selectedRows.length, rangeList.length, rangePagination),
            },
          });
        }
      });
    } else {
      dispatch({
        type: 'inventoryPlatform/updateState',
        payload: {
          rangeList: restData,
          list: list.map(e => e.stocktakeId === currentRecord.stocktakeId ? {
            ...e,
            [this.handleGetRangeListName(rangeObjectType)]: restData,
          } : e),
          rangePagination: delItemsToPagination(selectedRows.length, rangeList.length, rangePagination),
        },
      });
      if (rangeObjectType === 'PL') {
        this.setState({ prodLineDel: true });
      }
    }
  }

  @Bind()
  handleFetchBatchMaterialList(info = {}) {
    const { dispatch, inventoryPlatform: { rangeList, rangePagination } } = this.props;
    dispatch({
      type: 'inventoryPlatform/fetchBatchMaterialList',
      payload: {
        ...info,
        rangeList,
        rangePagination,
      },
    });
  }

  @Bind()
  handleFetchBatchProdLineList(info = {}) {
    const { dispatch, inventoryPlatform: { rangeList, rangePagination } } = this.props;
    dispatch({
      type: 'inventoryPlatform/fetchBatchProdLineList',
      payload: {
        ...info,
        rangeList,
        rangePagination,
      },
    });
  }

  @Bind()
  handleFetchBatchWorkcellList(info = {}) {
    const { dispatch, inventoryPlatform: { rangeList, rangePagination } } = this.props;
    dispatch({
      type: 'inventoryPlatform/fetchBatchWorkcellList',
      payload: {
        ...info,
        rangeList,
        rangePagination,
      },
    });
  }

  @Bind()
  handleCleanRangeList(record) {
    const { dispatch, inventoryPlatform: { list } } = this.props;
    const newList = list.map(e => record.stocktakeId === e.stocktakeId ? { ...e, materialRangeList: [], prodLineRangeList: [], workcellRangeList: []} : e);
    dispatch({
      type: 'inventoryPlatform/updateState',
      payload: {
        list: newList,
        rangeList: [],
        rangePagination: {},
      },
    });
  }


  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }



  // 渲染 界面布局
  render() {
    const {
      fetchListLoading,
      tenantId,
      fetchRangeListLoading,
      fetchBatchMaterialListLoading,
      fetchBatchProdLineListLoading,
      fetchBatchWorkcellListLoading,
      saveHeadListLoading,
      updateHeadListLoading,
      closeValidateLoading,
      closeLoading,
      completeValidateLoading,
      completeLoading,
      releaseLoading,
      saveRangeListLoading,
      deleteRangeListLoading,
      inventoryPlatform: {
        list = [],
        pagination = {},
        rangeList = [],
        rangePagination = {},
        statusCodeList = [],
      },
    } = this.props;
    const { selectedRows = [], currentRecord, rangeObjectType, visible, prodLineDel } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.stocktakeId),
      onChange: this.handleChangeSelectRows,
    };
    const filterProps = {
      tenantId,
      statusCodeList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };
    const listTableProps = {
      tenantId,
      rowSelection,
      loading: fetchListLoading || saveHeadListLoading || updateHeadListLoading || closeValidateLoading
        || closeLoading || completeValidateLoading || completeLoading
        || releaseLoading,
      pagination,
      dataSource: list,
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleSearch,
      onCreate: this.handleCreateHeadList,
      onSave: this.handleSaveHeadList,
      onOpenModal: this.handleOpenModal,
      onCleanRangeList: this.handleCleanRangeList,
      prodLineDel,
    };
    const materialDrawerProps = {
      tenantId,
      currentRecord,
      rangeObjectType,
      visible,
      dataSource: rangeList,
      pagination: rangePagination,
      loading: fetchRangeListLoading || fetchBatchMaterialListLoading || fetchBatchProdLineListLoading || fetchBatchWorkcellListLoading,
      saving: saveRangeListLoading,
      deleteLoading: deleteRangeListLoading,
      onRef: node => {
        this.drawerForm = node.props.form;
      },
      onEditLine: this.handleEditLine,
      onCleanLine: this.handleCleanLine,
      onSearch: this.handleFetchRangeList,
      onCreate: this.handleCreateRangeList,
      onSave: this.handleSaveRangeList,
      onCancel: this.handleCloseModal,
      onDelete: this.handleDelete,
      onFetchBatchItemList: this.handleFetchBatchMaterialList,
      onFetchBatchProdLineList: this.handleFetchBatchProdLineList,
      onFetchBatchWorkcellList: this.handleFetchBatchWorkcellList,
    };
    return (
      <div>
        <Header title="在制品盘点平台">
          <Button
            type="default"
            disabled={isEmpty(selectedRows)}
            onClick={this.handleToInventoryDetail}
          >
            在制盘点明细
          </Button>
          <Button
            type="default"
            disabled={isEmpty(selectedRows)}
            onClick={this.handleToInventorySummary}
          >
            在制盘点汇总
          </Button>
          <Button
            type="default"
            disabled={isEmpty(selectedRows)}
            onClick={this.handleToMaterialSummary}
          >
            在制盘点投料汇总
          </Button>
          <Button
            type="default"
            disabled={isEmpty(selectedRows) || (!selectedRows.every(e => ['NEW', 'RELEASED'].includes(e.stocktakeStatus)))}
            onClick={this.handleClose}
          >
            关闭
          </Button>
          <Button
            type="default"
            disabled={isEmpty(selectedRows) || (!selectedRows.every(e => ['RELEASED'].includes(e.stocktakeStatus)))}
            onClick={this.handleComplete}
          >
            完成
          </Button>
          <Button
            type="default"
            disabled={isEmpty(selectedRows) || (!selectedRows.every(e => ['NEW'].includes(e.stocktakeStatus)))}
            onClick={this.handleRelease}
          >
            下达
          </Button>
          <Button
            type="primary"
            onClick={this.handleCreateHeadList}
          >
            新建
          </Button>
          {selectedRows.length === 1 && (
            <ExcelExport
              exportAsync
              requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-wip-stocktake-docs/cos-inventory-export`}
              otherButtonProps={{ type: 'primary' }}
              queryParams={{ stocktakeNum: isEmpty(selectedRows) ? null : selectedRows[0].stocktakeNum }}
            />
          )}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <div className={styles['head-table']}>
            <ListTable {...listTableProps} />
          </div>
          <MaterialRangeDrawer {...materialDrawerProps} />
        </Content>
      </div>
    );
  }
}
