/**
 * PreInstalledPlatform - 物料预装平台
 * @date: 2020/06/29 19:07:54
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { getCurrentOrganizationId } from 'utils/utils';
import OperationPlatform from './PreOperationPlatform';

@connect(({ preInstalledPlatform, loading, global}) => ({
  preInstalledPlatform,
  global,
  tenantId: getCurrentOrganizationId(),
  fetchBaseInfoLoading: loading.effects['preInstalledPlatform/fetchBaseInfo'],
  addContainerLoading: loading.effects['preInstalledPlatform/addContainer'],
  outSiteLoading: loading.effects['preInstalledPlatform/outSite'],
  feedSerialItemLoading: loading.effects['preInstalledPlatform/feedSerialItem'],
  feedTimeItemLoading: loading.effects['preInstalledPlatform/feedTimeItem'],
  feedBatchItemLoading: loading.effects['preInstalledPlatform/feedBatchItem'],
  fetchSiteIdLoading: loading.effects['preInstalledPlatform/fetchDefaultSite'],
  addDataRecordLoading: loading.effects['preInstalledPlatform/addDataRecord'],
  fetchWorkCellInfoLoading: loading.effects['preInstalledPlatform/fetchWorkCellInfo'],
  fetchSnListLoading: loading.effects['preInstalledPlatform/fetchSnList'],
  fetchEquipmentListLoading: loading.effects['preInstalledPlatform/fetchEquipmentList'],
  deleteEqLoading: loading.effects['preInstalledPlatform/deleteEq'],
  changeEqLoading: loading.effects['preInstalledPlatform/changeEq'],
  bindingEqConfirmLoading: loading.effects['preInstalledPlatform/bindingEqConfirm'],
  fetchCompletedMaterialInfoLoading: loading.effects['preInstalledPlatform/fetchCompletedMaterialInfo'],
  changeEqConfirmLoading: loading.effects['preInstalledPlatform/changeEqConfirm'],
  fetchFeedingRecordLoading: loading.effects['preInstalledPlatform/fetchFeedingRecord'],
  feedMaterialItemLoading: loading.effects['preInstalledPlatform/feedMaterialItem'],
  checkBatchItemLoading: loading.effects['preInstalledPlatform/checkBatchItem'],
  checkTimeItemLoading: loading.effects['preInstalledPlatform/checkTimeItem'],
  checkSerialItemLoading: loading.effects['preInstalledPlatform/checkSerialItem'],
  deleteBatchItemLoading: loading.effects['preInstalledPlatform/deleteBatchItem'],
  deleteTimeItemLoading: loading.effects['preInstalledPlatform/deleteTimeItem'],
  deleteSerialItemLoading: loading.effects['preInstalledPlatform/deleteSerialItem'],
  fetchSerialItemListLoading: loading.effects['preInstalledPlatform/fetchSerialItemList'],
  fetchBatchItemListLoading: loading.effects['preInstalledPlatform/fetchBatchItemList'],
  fetchTimeItemListLoading: loading.effects['preInstalledPlatform/fetchTimeItemList'],
  refreshMaterialItemListLoading: loading.effects['preInstalledPlatform/refreshMaterialItemList'],
  returnMaterialLoading: loading.effects['preInstalledPlatform/returnMaterial'],
}))
export default class Lot extends PureComponent {

  render() {
    return (
      <OperationPlatform modelName="preInstalledPlatform" {...this.props} />
    );
  }
}

