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
import OperationPlatform from './FirstProcessPlatform';

@connect(({ firstProcessPlatform, loading, global }) => ({
  firstProcessPlatform,
  global,
  fetchWorkCellInfoLoading: loading.effects['firstProcessPlatform/fetchWorkCellInfo'],
  fetchBaseInfoLoading: loading.effects['firstProcessPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['firstProcessPlatform/addContainer'],
  outSiteLoading: loading.effects['firstProcessPlatform/outSite'],
  feedSerialItemLoading: loading.effects['firstProcessPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['firstProcessPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['firstProcessPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['firstProcessPlatform/fetchDefaultSite'],
  fetchEquipmentListLoading: loading.effects['firstProcessPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['firstProcessPlatform/deleteEq'],
  changeEqLoading: loading.effects['firstProcessPlatform/changeEq'],
  bindingEqLoading: loading.effects['firstProcessPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['firstProcessPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['firstProcessPlatform/changeEqConfirm'],
  addDataRecordLoading: loading.effects['firstProcessPlatform/addDataRecord'],
  fetchMaterialListLoading: loading.effects['firstProcessPlatform/fetchMaterialList'],
  fetchMaterialLotListLoading: loading.effects['firstProcessPlatform/fetchMaterialLotList'],
  fetchEoListLoading: loading.effects['firstProcessPlatform/fetchEoList'],
  fetchIsInMaterialLotLoading: loading.effects[`firstProcessPlatform/fetchIsInMaterialLot`],
  fetchIsContainerLoading: loading.effects['firstProcessPlatform/fetchIsContainer'],
  fetchFeedingRecordLoading: loading.effects['firstProcessPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['firstProcessPlatform/feedMaterialItem'],
  fetchVirtualNumListLoading: loading.effects['firstProcessPlatform/fetchVirtualNumList'],
  calculateLoading: loading.effects['firstProcessPlatform/calculate'],
  checkBatchItemLoading: loading.effects['firstProcessPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['firstProcessPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['firstProcessPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['firstProcessPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['firstProcessPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['firstProcessPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['firstProcessPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['firstProcessPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['firstProcessPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['firstProcessPlatform/refreshMaterialItemList'],
  returnMaterialLoading: loading.effects['firstProcessPlatform/returnMaterial'],
  feedMaterialListLoading: loading.effects['firstProcessPlatform/feedMaterialList'],
  deleteBarcodeLoading: loading.effects['firstProcessPlatform/deleteBarcodeLoading'],
  scanBarcodeLoading: loading.effects['firstProcessPlatform/scanBarcode'],
  fetchDataRecordListLoading: loading.effects['firstProcessPlatform/fetchDataRecordList'],
  fetchESopListLoading: loading.effects['firstProcessPlatform/fetchESopList'],
  tenantId: getCurrentOrganizationId(),
}))
export default class FirstProcess extends Component {

  render() {
    return (
      <OperationPlatform modelName="firstProcessPlatform" {...this.props} />
    );
  }
}

