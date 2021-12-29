/**
 * LotOperationPlatform - 批量工序作业平台
 * @date: 2020/06/29 19:08:28
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import OperationPlatform from './LotOperationPlatform';

@connect(({ lotOperationPlatform, loading, global}) => ({
  lotOperationPlatform,
  global,
  tenantId: getCurrentOrganizationId(),
  fetchBaseInfoLoading: loading.effects['lotOperationPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['lotOperationPlatform/addContainer'],
  outSiteLoading: loading.effects['lotOperationPlatform/outSite'],
  feedSerialItemLoading: loading.effects['lotOperationPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['lotOperationPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['lotOperationPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['lotOperationPlatform/fetchDefaultSite'],
  addDataRecordLoading: loading.effects['lotOperationPlatform/addDataRecord'],
  fetchWorkCellInfoLoading: loading.effects['lotOperationPlatform/fetchWorkCellInfo'],
  fetchSnListLoading: loading.effects['lotOperationPlatform/fetchSnList'],
  fetchEquipmentListLoading: loading.effects['lotOperationPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['lotOperationPlatform/deleteEq'],
  changeEqLoading: loading.effects['lotOperationPlatform/changeEq'],
  bindingEqLoading: loading.effects['lotOperationPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['lotOperationPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['lotOperationPlatform/changeEqConfirm'],
  lotOutSiteLoading: loading.effects['lotOperationPlatform/lotOutSite'],
  fetchFeedingRecordLoading: loading.effects['lotOperationPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['lotOperationPlatform/feedMaterialItem'],
  checkBatchItemLoading: loading.effects['lotOperationPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['lotOperationPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['lotOperationPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['lotOperationPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['lotOperationPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['lotOperationPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['lotOperationPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['lotOperationPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['lotOperationPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['lotOperationPlatform/refreshMaterialItemList'],
  returnMaterialLoading: loading.effects['lotOperationPlatform/returnMaterial'],
  clickSnListLoading: loading.effects['lotOperationPlatform/clickSnList'],
  fetchMaterialListLoading: loading.effects['lotOperationPlatform/fetchMaterialList'],
  scanBarcodeLoading: loading.effects['lotOperationPlatform/scanBarcode'],
  deleteBarcodeLoading: loading.effects['lotOperationPlatform/deleteBarcode'],
  feedMaterialListLoading: loading.effects['lotOperationPlatform/feedMaterialList'],
  batchOutSiteListLoading: loading.effects['lotOperationPlatform/batchOutSite'],
  fetchLocationInfoLoading: loading.effects['lotOperationPlatform/fetchLocationInfo'],
  fetchBackMaterialInfoLoading: loading.effects['lotOperationPlatform/fetchBackMaterialInfo'],
  fetchESopListLoading: loading.effects['lotOperationPlatform/fetchESopList'],
  fetchDataRecordListLoading: loading.effects['lotOperationPlatform/fetchDataRecordList'],
  printLoading: loading.effects['lotOperationPlatform/print'],
}))
export default class Lot extends PureComponent {

  render() {
    return (
      <OperationPlatform modelName="lotOperationPlatform" {...this.props} />
    );
  }
}

