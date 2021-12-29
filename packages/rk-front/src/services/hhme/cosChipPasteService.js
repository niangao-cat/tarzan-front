/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:52:05
 * @LastEditTime: 2020-08-31 09:58:40
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-20414';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
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
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备
export async function checkMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/prod-line-verify`, {
    method: 'GET',
    query: params,
  });
}

// 扫描盒子号
export async function scaneMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-chip-input/scan-barcode`, {
    method: 'GET',
    query: params,
  });
}

// 查询对应的设备信息
export async function queryLineData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-chip-input/query-hotSink`, {
    method: 'GET',
    query: params,
  });
}

// 保存对应的设备信息
export async function saveLineData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-chip-input/save-hotSink`, {
    method: 'POST',
    query: params,
  });
}

// 保存出战信息
export async function saveData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-chip-input/site-out`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace`, {
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

export function bindingEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding`, {
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


export function bindingEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function changeEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace/confirm`, {
    method: 'POST',
    body: params,
  });
}



