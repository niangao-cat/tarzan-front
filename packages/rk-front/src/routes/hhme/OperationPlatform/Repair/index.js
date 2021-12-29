/**
 * 自制件返修
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import OperationPlatform from './RepairPlatform';

@connect(({ repairPlatform, loading, global }) => ({
  repairPlatform,
  global,
  fetchBaseInfoLoading: loading.effects['repairPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['repairPlatform/addContainer'],
  outSiteLoading: loading.effects['repairPlatform/outSite'],
  feedSerialItemLoading: loading.effects['repairPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['repairPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['repairPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['repairPlatform/fetchDefaultSite'],
  fetchEquipmentListLoading: loading.effects['repairPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['repairPlatform/deleteEq'],
  changeEqLoading: loading.effects['repairPlatform/changeEq'],
  bindingEqLoading: loading.effects['repairPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['repairPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['repairPlatform/changeEqConfirm'],
  addDataRecordLoading: loading.effects['repairPlatform/addDataRecord'],
  fetchMaterialListLoading: loading.effects['repairPlatform/fetchMaterialList'],
  addDataRecordBatchLoading: loading.effects['repairPlatform/addDataRecordBatch'],
  fetchFeedingRecordLoading: loading.effects['repairPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['repairPlatform/feedMaterialItem'],
  checkBatchItemLoading: loading.effects['repairPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['repairPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['repairPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['repairPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['repairPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['repairPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['repairPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['repairPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['repairPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['repairPlatform/refreshMaterialItemList'],
  fetchLocationInfoLoading: loading.effects['repairPlatform/fetchLocationInfo'],
  returnMaterialLoading: loading.effects['repairPlatform/returnMaterial'],
  fetchBackMaterialInfoLoading: loading.effects['repairPlatform/fetchBackMaterialInfo'],
  scanBarcodeLoading: loading.effects['repairPlatform/scanBarcode'],
  feedMaterialListLoading: loading.effects['repairPlatform/feedMaterialList'],
  fetchESopListLoading: loading.effects['repairPlatform/fetchESopList'],
  fetchSnDataListLoading: loading.effects['repairPlatform/fetchSnDataList'],
  fetchComponentDataLoading: loading.effects['repairPlatform/fetchComponentDataList'],
  fetchPumpListLoading: loading.effects['repairPlatform/fetchPumpList'],
  tenantId: getCurrentOrganizationId(),
}))
export default class Repair extends Component {

  render() {
    return (
      <OperationPlatform modelName="repairPlatform" {...this.props} />
    );
  }
}

