/*
 * @Description: 设备台账管理
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-02 10:19:17
 */

import React, { Component } from 'react';
import { Button, notification } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { Fields, Button as ButtonPermission } from 'components/Permission';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { encryption } from '@/utils/utils';
import { isEmpty, isUndefined } from 'lodash';
import { openTab } from 'utils/menuTab';

import queryString from 'querystring';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import MoreSearchModal from './MoreSearchModal';
import ListHistoryTable from './Detail/ListHistoryTable';

import StationChangeHistoryModal from './StationChangeHistoryModal';
import CheckModal from './CheckModal';

notification.config({
  placement: 'bottomRight',
  bottom: 100,
  duration: 3,
});

@connect(({ equipmentLedgerManagement, loading }) => ({
  equipmentLedgerManagement,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['equipmentLedgerManagement/fetchDeviceList'],
  historyLoading: loading.effects['equipmentLedgerManagement/searchHistory'],
  fetchStationChangeHistoryLoading:
    loading.effects['equipmentLedgerManagement/stationChangeHistory'],
  creatingDocLoading: loading.effects['equipmentLedgerManagement/creatingDoc'],
  fetchListLoading: loading.effects['equipmentLedgerManagement/fetchList'],
}))
export default class EquipmentLedgerManagement extends Component {
  form;

  formMore;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      showTable: true,
      stationChangeHistorVisible: false,
      createInventoryVisible: false,
      selectedRowKeys: [],
      selectedRows: [],
      moreSearchCache: {}, // 更多查询缓存
      historyVisible: false,
      loading: false,
      printingBarcodeLoading: false,
      printingCheckLoading: false,
    };
  }

  async componentDidMount() {
    const { dispatch, tenantId } = this.props;
    await dispatch({
      type: 'equipmentLedgerManagement/fetchDepartment',
      payload: {
        tenantId,
      },
    }).then(res => {
      if (res) {
        if (this.formMore) {
          this.formMore.setFieldsValue({
            businessId: (res && res.map(e => e.areaId)).toString(),
          });
        }
      }
    });
    await dispatch({
      type: 'equipmentLedgerManagement/updateState',
      payload: {
        deviceDetail: {},
      },
    });
    await dispatch({
      type: 'equipmentLedgerManagement/batchLovData',
      payload: {
        tenantId,
      },
    });
    await this.fetchALL();
  }

  @Bind()
  fetchALL() {
    const moreValue = (this.formMore && this.formMore.getFieldsValue()) || {};
    // console.log('moreValue=', moreValue);
    this.handleMoreSearchModal({}, moreValue);
  }

  // 设备台账列表
  @Bind()
  fetchComDeviceList(fields = {}) {
    const {
      dispatch,
      equipmentLedgerManagement: { search = {} },
    } = this.props;
    dispatch({
      type: 'equipmentLedgerManagement/fetchDeviceList',
      payload: {
        ...search,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 设备台账列表
  @Bind()
  fetchDeviceList(fields = {}) {
    const {
      dispatch,
      equipmentLedgerManagement: { search = {} },
    } = this.props;
    const fieldsValue = (this.form && this.form.getFieldsValue()) || {};
    const { moreSearchCache } = this.state;
    this.setState({ showTable: false }, () => {
      this.setState({ showTable: true });
      if (this.formMore) {
        this.formMore.validateFields(err => {
          if (err) {
            notification.warning({ description: '当前有必输条件未输入，请打开更多查询！' });
          } else {
            // 执行查询逻辑
            dispatch({
              type: 'equipmentLedgerManagement/fetchDeviceList',
              payload: {
                ...filterNullValueObject({
                  ...moreSearchCache,
                  postingDateStart:
                    moreSearchCache.postingDateStart &&
                    `${moreSearchCache.postingDateStart.format('YYYY-MM-DD')} 00:00:00`,
                  postingDateEnd:
                    moreSearchCache.postingDateEnd &&
                    `${moreSearchCache.postingDateEnd.format('YYYY-MM-DD')} 23:59:59`,
                  ...search,
                  ...fieldsValue,
                  assetEncoding: isEmpty(fieldsValue.assetEncoding) ? null : fieldsValue.assetEncoding.join(','),
                }),
                page: isEmpty(fields) ? {} : fields,
              },
            });

            dispatch({
              type: 'equipmentLedgerManagement/updateState',
              payload: {
                search: {
                  ...moreSearchCache,
                  postingDateStart:
                    moreSearchCache.postingDateStart &&
                    `${moreSearchCache.postingDateStart.format('YYYY-MM-DD')} 00:00:00`,
                  postingDateEnd:
                    moreSearchCache.postingDateEnd &&
                    `${moreSearchCache.postingDateEnd.format('YYYY-MM-DD')} 23:59:59`,
                  ...search,
                  ...fieldsValue,
                },
              },
            });
          }
        });
      }
    });
    this.setState({ selectedRowKeys: [] });
  }

  /**
   * 传递表单对象(传递子组件对象form，给父组件用)
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind()
  handleBindRefMore(ref = {}) {
    this.formMore = (ref.props || {}).form;
  }

  // 新建或进入明细页面
  @Bind()
  handleAddData(record) {
    const { history } = this.props;
    history.push(`/hhme/equipment-LedgerManagement/detail/${record.equipmentId}`);
  }

  // 模态框控制
  @Bind()
  hideOrOpenModal(val) {
    this.setState({ visible: val });
  }

  // 模态框控制
  @Bind()
  hideOrOpenHistoryModal() {
    this.setState({ historyVisible: false });
  }

  // 更多查询
  @Bind()
  handleMoreSearchModal(fields, moreSearch) {
    this.hideOrOpenModal(false);
    this.setState({ moreSearchCache: moreSearch }, () => {
      const { dispatch } = this.props;
      const fieldsValue = (this.form && this.form.getFieldsValue()) || {};
      dispatch({
        type: 'equipmentLedgerManagement/fetchDeviceList',
        payload: {
          ...moreSearch,
          postingDateStart:
            moreSearch.postingDateStart &&
            `${moreSearch.postingDateStart.format('YYYY-MM-DD')} 00:00:00`,
          postingDateEnd:
            moreSearch.postingDateEnd && `${moreSearch.postingDateEnd.format('YYYY-MM-DD')} 23:59:59`,
          ...fieldsValue,
          page: isEmpty(fields) ? {} : fields,
        },
      });
      dispatch({
        type: 'equipmentLedgerManagement/updateState',
        payload: {
          search: {
            ...moreSearch,
            postingDateStart:
              moreSearch.postingDateStart &&
              `${moreSearch.postingDateStart.format('YYYY-MM-DD')} 00:00:00`,
            postingDateEnd:
              moreSearch.postingDateEnd && `${moreSearch.postingDateEnd.format('YYYY-MM-DD')} 23:59:59`,
            ...fieldsValue,
          },
        },
      });
    });
  }

  // 台账历史
  @Bind()
  handleSearchHistoryModal(page = {}) {
    // 判断是否选择数据， 没有则报错
    if (this.state.selectedRowKeys.length === 0) {
      return notification.error({ message: '请先选中数据' });
    }

    const { dispatch } = this.props;
    if (this.state.selectedRows.length === 1) {
      this.setState({ historyVisible: true });
      dispatch({
        type: 'equipmentLedgerManagement/searchHistory',
        payload: {
          equipmentId: this.state.selectedRows[0].equipmentId,
          page,
        },
      });
    } else {
      notification.error({ message: '请勾选单条数据!' });
    }
  }

  // 清除更多查询缓存
  @Bind()
  clearMoreSearchCache() {
    this.setState({ moreSearchCache: {} });
    const { dispatch } = this.props;
    dispatch({
      type: 'equipmentLedgerManagement/updateState',
      payload: {
        search: {},
      },
    });
  }

  // 控制历史模态框展示收起
  @Bind()
  setStationChangeHistoryVisible(flag) {
    this.setState({ stationChangeHistorVisible: flag });
  }

  // 打开工位变更历史模态框
  @Bind()
  stationChangeHistory(fields = {}) {
    const { dispatch } = this.props;
    const { selectedRows = [] } = this.state;
    const { startTime, endTime } = fields;
    if (selectedRows.length === 1) {
      this.setStationChangeHistoryVisible(true);
      dispatch({
        type: 'equipmentLedgerManagement/stationChangeHistory',
        payload: {
          equipmentId: selectedRows[0].equipmentId,
          startTime: startTime && startTime.format('YYYY-MM-DD HH:mm:ss'),
          endTime: endTime && endTime.format('YYYY-MM-DD HH:mm:ss'),
          page: isEmpty(fields) ? {} : fields,
        },
      });
    } else {
      notification.error({ message: '请勾选单条数据!' });
    }
  }

  // 控制设备盘点收起
  @Bind()
  setCreateInventoryVisible(flag) {
    this.setState({ createInventoryVisible: flag });
  }

  // 打开设备盘点创建模态框
  @Bind()
  createInventory() {
    this.setCreateInventoryVisible(true);
    if (!isEmpty(this.moreSearchCache) && this.moreSearchCache.businessId !== undefined) {
      this.form.setFieldsValue({
        businessId: this.moreSearchCache.businessId,
      });
    }
  }

  // 设备盘点 创建单据
  @Bind()
  handleOnSubmit(fieldValues) {
    this.setState({ loading: true });
    const {
      equipmentLedgerManagement: { search = {} },
      dispatch,
      tenantId,
    } = this.props;
    const fieldsValues = (this.form && this.form.getFieldsValue()) || {};
    const { moreSearchCache } = this.state;
    dispatch({
      type: 'equipmentLedgerManagement/fetchList',
      payload: {
        tenantId,
        ...moreSearchCache,
        postingDateStart:
          moreSearchCache.postingDateStart &&
          `${moreSearchCache.postingDateStart.format('YYYY-MM-DD')} 00:00:00`,
        postingDateEnd:
          moreSearchCache.postingDateEnd &&
          `${moreSearchCache.postingDateEnd.format('YYYY-MM-DD')} 23:59:59`,
        ...search,
        ...fieldsValues,
        page: { pageSize: 99999 },
      },
    }).then((res) => {
      if (res) {
        dispatch({
          type: 'equipmentLedgerManagement/creatingDoc',
          payload: {
            ...fieldValues,
            businessId: isUndefined(moreSearchCache.businessId) ? '' : moreSearchCache.businessId.toString(),
            ledgerType: isUndefined(fieldsValues.ledgerTypeList) ? '' : fieldsValues.ledgerTypeList.toString(),
            equipmentList: res,
          },
        }).then(result => {
          if (result && result.stocktakeId) {
            this.setState({ loading: false });
            notification.success({ message: '创建盘点成功!' });
            this.setState({ createInventoryVisible: false });
          } else {
            this.setState({ loading: false });
            notification.error({ message: '创建盘点失败!' });
          }
        });
      }
    });
  }

  /**
   * @description: 选中行数据
   * @param {Array} selectedRowKeys 键
   * @param {Array} selectedRows 值
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  @Bind()
  handleGetFormValue() {
    const filterValue = this.form === undefined ? {} : this.form.getFieldsValue();
    return filterNullValueObject({
      ...filterValue,
      ...this.state.moreSearchCache,
      assetEncoding: isEmpty(filterValue.assetEncoding) ? null : filterValue.assetEncoding.join(','),
    });
  }

  /**
   * 批量导入
   */
  @Bind()
  handleBatchImport() {
    openTab({
      key: '/hhme/equipment-LedgerManagement/data-import/HME.EQUIPMENT',
      search: queryString.stringify({
        key: '/hhme/equipment-LedgerManagement/data-import/HME.EQUIPMENT',
        title: 'hzero.common.title.batchImport',
        action: 'hzero.common.title.batchImport',
      }),
    });
  }

  // 标签打印
  @Bind
  handlePrintingSingle() {
    this.setState({ printingCheckLoading: true });
    const {
      dispatch,
      equipmentLedgerManagement: {
        pagination = {},
      },
    } = this.props;
    const { selectedRows } = this.state;
    if (isEmpty(selectedRows)) {
      this.setState({ printingCheckLoading: false });
      notification.error({
        message: '请先选中数据!',
      });
    } else {
      selectedRows.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.encryptionAssetEncoding = encryption(element.assetEncoding);
      });
      dispatch({
        type: 'equipmentLedgerManagement/printingCheck',
        payload: {
          hmeEquipmentVOList: selectedRows,
          printType: '1',
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'equipmentLedgerManagement/printingBarcode',
            payload: {
              hmeEquipmentVOList: selectedRows,
              printType: '1',
            },
          }).then(result => {
            if (result) {
              const file = new Blob(
                [result],
                { type: 'application/pdf' },
              );
              const fileURL = URL.createObjectURL(file);
              const newwindow = window.open(fileURL, 'newwindow');
              if (newwindow) {
                newwindow.print();
                this.fetchDeviceList(pagination);
                this.setState({ 'selectedRows': [] });
                this.setState({ printingCheckLoading: false });
              }
            }
          });
        } else {
          this.setState({ printingCheckLoading: false });
        }
      });
    }
  }

  // 标签补打
  @Bind
  handlePrinting() {
    this.setState({ printingBarcodeLoading: true });
    const {
      dispatch,
      equipmentLedgerManagement: {
        pagination = {},
      },
    } = this.props;
    const { selectedRows } = this.state;
    if (isEmpty(selectedRows)) {
      this.setState({ printingBarcodeLoading: false });
      notification.error({
        message: '请先选中数据!',
      });
    } else {
      selectedRows.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.encryptionAssetEncoding = encryption(element.assetEncoding);
      });
      dispatch({
        type: 'equipmentLedgerManagement/printingCheck',
        payload: {
          hmeEquipmentVOList: selectedRows,
          printType: '2',
        },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'equipmentLedgerManagement/printingBarcode',
            payload: {
              hmeEquipmentVOList: selectedRows,
              printType: '2',
            },
          }).then(result => {
            if (result) {
              const file = new Blob(
                [result],
                { type: 'application/pdf' },
              );
              const fileURL = URL.createObjectURL(file);
              const newwindow = window.open(fileURL, 'newwindow');
              if (newwindow) {
                newwindow.print();
                this.fetchDeviceList(pagination);
                this.setState({ 'selectedRows': [] });
                this.setState({ printingBarcodeLoading: false });
              }
            }
          });
        }
      });
    }
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const filterValue = this.form === undefined ? {} : this.form.getFieldsValue();
    const {
      stationChangeHistorVisible,
      selectedRowKeys,
      moreSearchCache,
      historyVisible,
      loading,
      printingBarcodeLoading,
      printingCheckLoading,
    } = this.state;
    const {
      equipmentLedgerManagement: {
        deviceList = [],
        pagination = {},
        assetClass = [],
        equipmentCategory = [],
        applyType = [],
        equipmentStatus = [],
        useFrequency = [],
        stationChangeHistoryList = [],
        stationChangeHistoryListPagination = {},
        ledgerType = [],
        equipmentType = [],
        managementModeList = [],
        applyTypeList = [],
        historyList = [],
        historypagination = {},
        stocktakeTypeList = [],
        stocktakeStatusList = [],
      },
      tenantId,
      fetchLoading,
      historyLoading,
      fetchStationChangeHistoryLoading,
    } = this.props;
    const filterProps = {
      ledgerType,
      equipmentStatus,
      equipmentType,
      managementModeList,
      applyTypeList,
      onRef: this.handleBindRef,
      onSearch: this.fetchDeviceList,
      handleMoreSearch: this.hideOrOpenModal,
      clearMoreSearchCache: this.clearMoreSearchCache,
    };
    const listProps = {
      pagination,
      dataSource: deviceList,
      selectedRowKeys,
      onSelectRow: this.handleSelectRow,
      onSearch: this.fetchDeviceList,
      loading: fetchLoading,
      handleUpdateData: this.handleAddData,
    };
    const moreSearchModalProps = {
      visible: this.state.visible,
      assetClass,
      equipmentCategory,
      applyType,
      equipmentStatus,
      useFrequency,
      tenantId,
      moreSearchCache,
      onCancel: this.hideOrOpenModal,
      onMoreSearch: this.handleMoreSearchModal,
      clearMoreSearchCache: this.clearMoreSearchCache,
    };
    const historyModalProps = {
      loading: historyLoading,
      dataSource: historyList,
      pagination: historypagination,
      visible: this.state.historyVisible,
      onCancel: this.hideOrOpenHistoryModal,
      onSearch: this.handleSearchHistoryModal,
    };
    const checkModalProps = {
      stocktakeTypeList,
      stocktakeStatusList,
      visible: this.state.createInventoryVisible,
      onCancel: this.setCreateInventoryVisible,
      onSubmit: this.handleOnSubmit,
      moreSearchCache,
      filterValue,
      ledgerType,
      loading,
    };
    return (
      <React.Fragment>
        <Header title="">
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.handleAddData({ equipmentId: 'create' })}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            onClick={this.stationChangeHistory}
            icon="clock-circle-o"
            disabled={selectedRowKeys.length === 0}
          >
            工位变更历史
          </Button>
          <ButtonPermission
            onClick={this.handleBatchImport}
            icon="to-top"
            permissionList={[
              {
                code: 'hwms.equipment.ledger.management.import',
                type: 'button',
                meaning: '批量导入',
              },
            ]}
          >
            批量导入
          </ButtonPermission>
          <Fields
            permissionList={[
              {
                code: 'hwms.equipment.ledger.management.export',
                type: 'fields',
                meaning: '导出',
              },
            ]}
          >
            <ExcelExport
              exportAsync
              requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-equipment/export`} // 路径
              otherButtonProps={{ type: 'primary' }}
              queryParams={this.handleGetFormValue}
            />
          </Fields>
          <Button
            type="primary"
            // icon="plus"
            onClick={() => this.handleSearchHistoryModal()}
          >
            {intl.get('hzero.common.button.history').d('台账修改历史')}
          </Button>
          <ButtonPermission
            onClick={this.createInventory}
            icon="plus"
            type="primary"
            permissionList={[
              {
                code: 'hwms.equipment.ledger.management.button.inventory',
                type: 'button',
                meaning: '创建盘点',
              },
            ]}
          >
            创建盘点
          </ButtonPermission>
          {/* <Button */}
          {/*   onClick={this.createInventory} */}
          {/*   icon="plus" */}
          {/*   type="primary" */}
          {/*   // disabled={selectedRowKeys.length === 0} */}
          {/* > */}
          {/*   创建盘点 */}
          {/* </Button> */}
          <ButtonPermission
            onClick={() => this.handlePrintingSingle()}
            type="primary"
            loading={printingCheckLoading}
            permissionList={[
              {
                code: 'hwms.equipment.ledger.management.button.printingsingle',
                type: 'button',
                meaning: '标签打印',
              },
            ]}
          >
            标签打印
          </ButtonPermission>
          {/* <Button */}
          {/*   onClick={() => this.handlePrintingSingle()} */}
          {/*   type="primary" */}
          {/*   loading={printLoading} */}
          {/*   // disabled={selectedRowKeys.length === 0} */}
          {/* > */}
          {/*   标签打印 */}
          {/* </Button> */}
          <ButtonPermission
            onClick={() => this.handlePrinting()}
            type="primary"
            loading={printingBarcodeLoading}
            permissionList={[
              {
                code: 'hwms.equipment.ledger.management.button.printing',
                type: 'button',
                meaning: '标签补打',
              },
            ]}
          >
            标签补打
          </ButtonPermission>
          {/* <Button */}
          {/*   onClick={() => this.handlePrinting()} */}
          {/*   type="primary" */}
          {/*   loading={printLoading} */}
          {/*   // disabled={selectedRowKeys.length === 0} */}
          {/* > */}
          {/*   标签补打 */}
          {/* </Button> */}
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          {this.state.showTable && (<ListTable {...listProps} />)}
          <MoreSearchModal {...moreSearchModalProps} onRef={this.handleBindRefMore} />
          {/* {visible && <MoreSearchModal {...moreSearchModalProps} onRef={this.handleMoreBindRef} />} */}
          {stationChangeHistorVisible && (
            <StationChangeHistoryModal
              visible={stationChangeHistorVisible}
              onCancel={this.setStationChangeHistoryVisible}
              loading={fetchStationChangeHistoryLoading}
              dataSource={stationChangeHistoryList}
              pagination={stationChangeHistoryListPagination}
              onSearch={this.stationChangeHistory}
            />
          )}
          {historyVisible && <ListHistoryTable {...historyModalProps} />}
          <CheckModal {...checkModalProps} />
        </Content>
      </React.Fragment>
    );
  }
}
