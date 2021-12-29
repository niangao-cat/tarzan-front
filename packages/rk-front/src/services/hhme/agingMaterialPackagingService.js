/*
 * @Description: 物料转移
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-12 11:02:16
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-10 16:48:06
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 扫描条码
export async function scanMaterialLotCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-time-material-split/scan/barcode/${params.materialLotCode}`, {
    method: 'GET',
    query: params,
  });
}

// 原材料剩余时长提交
export async function rawMaterialsTime(params) {
  return request(`${Host}/v1/${organizationId}/hme-time-material-split/source-time-submit`, {
  // request(`${Host}/v1/${organizationId}/hme-time-material-split/time/submit`, {
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

// 目标条码确认
export async function targetConfirm(params) {
  return request(`${Host}/v1/${organizationId}/hme-time-material-split/confirm`, {
    method: 'POST',
    body: params,
  });
}

// 扫描条码
export async function sacnTargetCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-material-transfers/target/info/ui`, {
    method: 'GET',
    query: params,
  });
}
