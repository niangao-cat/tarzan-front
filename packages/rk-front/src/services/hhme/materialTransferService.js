/*
 * @Description: 物料转移
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-12 11:02:16
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-24 14:32:16
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 物料数据
export async function getMaterialData(params) {
  return request(`${Host}/v1/${organizationId}/hme-material-transfers/transfer/list/ui`, {
    method: 'POST',
    body: params.param,
  });
}

// 目标区域
export async function getMaterialTransfers(params) {
  return request(`${Host}/v1/${organizationId}/hme-material-transfers/target/list/ui`, {
    method: 'POST',
    body: params.barCodeList,
  });
}

// 转移确认
export async function onSubmit(params) {
  return request(`${Host}/v1/${organizationId}/hme-material-transfers/confirm/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 条码打印
 * @param params
 * @returns {Promise<void>}
 */
export async function printingBarcode(params) {
  return request(`${Host}/v1/${organizationId}/wms-material-log-print/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 扫描条码
export async function sacnTargetCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-material-transfers/target/info/ui`, {
    method: 'GET',
    query: params,
  });
}
