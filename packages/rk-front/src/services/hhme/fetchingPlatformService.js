/*
 * @Description: 取片
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-08 10:03:12
 * @LastEditTime: 2020-11-03 17:27:38
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-20491';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 输入工位
export async function enterSite(params) {
  return request(`/mes/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 查询设备
export async function getEquipmentList(params) {
  return request(`/mes/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

// 待取片条码扫描
export async function scaneMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/scan-barcode`, {
    method: 'POST',
    body: params,
  });
}

// 获取未操作的数据
export async function queryProcessing(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/query-processing`, {
    method: 'GET',
    query: params,
  });
}

// 创建条码
export async function createBarCode(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-out-created`, {
    method: 'POST',
    body: params,
  });
}

// 出站
export async function siteOutPrint(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-out`, {
    method: 'POST',
    body: params,
  });
}

// 打印
export async function siteOutPrintList(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-out-print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 出站确认
export async function siteInConfirm(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-in-confirm`, {
    method: 'POST',
    body: params,
  });
}

// 获取未操作的数据
export async function queryMaxNumber(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/load-number/max/query`, {
    method: 'GET',
    query: params,
  });
}

// 绑定设备
export function bindingEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding`, {
    method: 'POST',
    body: params,
  });
}

// 绑定确定
export function bindingEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function deleteEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/unbinding`, {
    method: 'DELETE',
    body: params,
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace`, {
    method: 'POST',
    body: params,
  });
}

export function fetchEqInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/${params.eqCode}`, {
    method: 'GET',
    responseType: 'text',
  });
}

// 投入确认
export function putInConfirm(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-in-confirm`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export function deleteBoxList(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/fetch-out-delete`, {
    method: 'POST',
    body: params,
  });
}

// 查询不良列表
export async function fetchNcList(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/query-nc/${params.materialLotId}`, {
    method: 'GET',
    query: params,
  });
}

// 查询投入盒子列表
export async function fetchBoxList(params) {
  return request(`${Host}/v1/${tenantId}/cos-get-chip-platform/query-input-materiallot`, {
    method: 'GET',
    query: params,
  });
}

export function checkInSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/prod-line-verify`, {
    method: 'GET',
    query: params,
  });
}



