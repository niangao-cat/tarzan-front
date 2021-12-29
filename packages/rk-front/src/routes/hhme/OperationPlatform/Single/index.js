/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/06/29 19:07:20
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import OperationPlatform from './SingleOperationPlatform';

@connect(({ singleOperationPlatform, loading, global }) => ({
  singleOperationPlatform,
  global,
  fetchWorkCellInfoLoading: loading.effects['singleOperationPlatform/fetchWorkCellInfo'],
  fetchBaseInfoLoading: loading.effects['singleOperationPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['singleOperationPlatform/addContainer'],
  outSiteLoading: loading.effects['singleOperationPlatform/outSite'],
  feedSerialItemLoading: loading.effects['singleOperationPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['singleOperationPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['singleOperationPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['singleOperationPlatform/fetchDefaultSite'],
  fetchEquipmentListLoading: loading.effects['singleOperationPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['singleOperationPlatform/deleteEq'],
  changeEqLoading: loading.effects['singleOperationPlatform/changeEq'],
  bindingEqLoading: loading.effects['singleOperationPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['singleOperationPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['singleOperationPlatform/changeEqConfirm'],
  addDataRecordLoading: loading.effects['singleOperationPlatform/addDataRecord'],
  addDataRecordBatchLoading: loading.effects['singleOperationPlatform/addDataRecordBatch'],
  fetchFeedingRecordLoading: loading.effects['singleOperationPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['singleOperationPlatform/feedMaterialItem'],
  checkBatchItemLoading: loading.effects['singleOperationPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['singleOperationPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['singleOperationPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['singleOperationPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['singleOperationPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['singleOperationPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['singleOperationPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['singleOperationPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['singleOperationPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['singleOperationPlatform/refreshMaterialItemList'],
  fetchLocationInfoLoading: loading.effects['singleOperationPlatform/fetchLocationInfo'],
  returnMaterialLoading: loading.effects['singleOperationPlatform/returnMaterial'],
  fetchBomListLoading: loading.effects['singleOperationPlatform/fetchBomList'],
  fetchBackMaterialInfoLoading: loading.effects['singleOperationPlatform/fetchBackMaterialInfo'],
  deleteDataLoading: loading.effects['singleOperationPlatform/deleteData'],
  deleteAndBandLoading: loading.effects['singleOperationPlatform/deleteAndBand'],
  fetchMaterialListLoading: loading.effects['singleOperationPlatform/fetchMaterialList'],
  scanBarcodeLoading: loading.effects['singleOperationPlatform/scanBarcode'],
  deleteBarcodeLoading: loading.effects['singleOperationPlatform/deleteBarcode'],
  feedMaterialListLoading: loading.effects['singleOperationPlatform/feedMaterialList'],
  fetchWorkCellMaterialListLoading: loading.effects['singleOperationPlatform/fetchWorkCellMaterialList'],
  fetchESopListLoading: loading.effects['singleOperationPlatform/fetchESopList'],
  fetchEOListLoading: loading.effects['singleOperationPlatform/fetchEOList'],
  fetchSnDataListLoading: loading.effects['singleOperationPlatform/fetchSnDataList'],
  fetchComponentDataLoading: loading.effects['singleOperationPlatform/fetchComponentDataList'],
  fetchPumpListLoading: loading.effects['singleOperationPlatform/fetchPumpList'],
  tenantId: getCurrentOrganizationId(),
}))
export default class Single extends Component {

  render() {
    return (
      <OperationPlatform modelName="singleOperationPlatform" {...this.props} />
    );
  }
}

