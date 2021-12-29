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
import OperationPlatform from './PumpPlatform';

@connect(({ pumpPlatform, loading, global }) => ({
  pumpPlatform,
  global,
  fetchWorkCellInfoLoading: loading.effects['pumpPlatform/fetchWorkCellInfo'],
  fetchBaseInfoLoading: loading.effects['pumpPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['pumpPlatform/addContainer'],
  outSiteLoading: loading.effects['pumpPlatform/outSite'],
  feedSerialItemLoading: loading.effects['pumpPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['pumpPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['pumpPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['pumpPlatform/fetchDefaultSite'],
  fetchEquipmentListLoading: loading.effects['pumpPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['pumpPlatform/deleteEq'],
  changeEqLoading: loading.effects['pumpPlatform/changeEq'],
  bindingEqLoading: loading.effects['pumpPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['pumpPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['pumpPlatform/changeEqConfirm'],
  addDataRecordLoading: loading.effects['pumpPlatform/addDataRecord'],
  fetchMaterialListLoading: loading.effects['pumpPlatform/fetchMaterialList'],
  fetchMaterialLotListLoading: loading.effects['pumpPlatform/fetchMaterialLotList'],
  fetchEoListLoading: loading.effects['pumpPlatform/fetchEoList'],
  fetchIsInMaterialLotLoading: loading.effects[`pumpPlatform/fetchIsInMaterialLot`],
  fetchIsContainerLoading: loading.effects['pumpPlatform/fetchIsContainer'],
  fetchFeedingRecordLoading: loading.effects['pumpPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['pumpPlatform/feedMaterialItem'],
  fetchVirtualNumListLoading: loading.effects['pumpPlatform/fetchVirtualNumList'],
  calculateLoading: loading.effects['pumpPlatform/calculate'],
  checkBatchItemLoading: loading.effects['pumpPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['pumpPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['pumpPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['pumpPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['pumpPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['pumpPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['pumpPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['pumpPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['pumpPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['pumpPlatform/refreshMaterialItemList'],
  returnMaterialLoading: loading.effects['pumpPlatform/returnSnMaterial'] || loading.effects['pumpPlatform/returnMaterial'],
  feedMaterialListLoading: loading.effects['pumpPlatform/feedMaterialList'],
  deleteBarcodeLoading: loading.effects['pumpPlatform/deleteBarcodeLoading'],
  scanBarcodeLoading: loading.effects['pumpPlatform/scanBarcode'],
  fetchDataRecordListLoading: loading.effects['pumpPlatform/fetchDataRecordList'],
  fetchESopListLoading: loading.effects['pumpPlatform/fetchESopList'],
  autoCreateSnNumLoading: loading.effects['pumpPlatform/autoCreateSnNum'],
  tenantId: getCurrentOrganizationId(),
}))
export default class FirstProcess extends Component {

  render() {
    return (
      <OperationPlatform modelName="pumpPlatform" {...this.props} />
    );
  }
}

