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
import OperationPlatform from './Component';

@connect(({ operationPlatform, loading, global }) => ({
  operationPlatform,
  global,
  fetchBaseInfoLoading: loading.effects['operationPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['operationPlatform/addContainer'],
  outSiteLoading: loading.effects['operationPlatform/outSite'],
  feedSerialItemLoading: loading.effects['operationPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['operationPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['operationPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['operationPlatform/fetchDefaultSite'],
  fetchEquipmentListLoading: loading.effects['operationPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['operationPlatform/deleteEq'],
  changeEqLoading: loading.effects['operationPlatform/changeEq'],
  bindingEqLoading: loading.effects['operationPlatform/bindingEq'],
  bindingEqConfirmLoading: loading.effects['operationPlatform/bindingEqConfirm'],
  changeEqConfirmLoading: loading.effects['operationPlatform/changeEqConfirm'],
  addDataRecordLoading: loading.effects['operationPlatform/addDataRecord'],
  fetchMaterialListLoading: loading.effects['operationPlatform/fetchMaterialList'],
  addDataRecordBatchLoading: loading.effects['operationPlatform/addDataRecordBatch'],
  fetchFeedingRecordLoading: loading.effects['operationPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['operationPlatform/feedMaterialItem'],
  checkBatchItemLoading: loading.effects['operationPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['operationPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['operationPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['operationPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['operationPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['operationPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['operationPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['operationPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['operationPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['operationPlatform/refreshMaterialItemList'],
  fetchLocationInfoLoading: loading.effects['operationPlatform/fetchLocationInfo'],
  returnMaterialLoading: loading.effects['operationPlatform/returnMaterial'],
  fetchBackMaterialInfoLoading: loading.effects['operationPlatform/fetchBackMaterialInfo'],
  deleteDataLoading: loading.effects['operationPlatform/deleteData'],
  deleteAndBandLoading: loading.effects['operationPlatform/deleteAndBand'],
  fetchBomListLoading: loading.effects['operationPlatform/fetchBomList'],
  tenantId: getCurrentOrganizationId(),
}))
export default class Single extends Component {

  render() {
    return (
      <OperationPlatform modelName="operationPlatform" {...this.props} />
    );
  }
}

