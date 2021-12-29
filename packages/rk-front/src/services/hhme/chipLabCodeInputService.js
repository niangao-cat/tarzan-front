/*
 * @Description: 芯片不良
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-21 13:52:05
 * @LastEditTime: 2020-10-27 11:47:18
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-17823';

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
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 获取可选的不良代码
export async function fetchNcCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-poor-inspection/get-nc-code`, {
    method: 'GET',
    query: params,
  });
}

// 查询设备
export async function getEquipmentList(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

// 芯片不良记录进站
export async function scanMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-lab-code-input/scan-barcode/${params}`, {
    method: 'GET',
  });
}

// 确认
export async function confirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-lab-code-input/confirm`, {
    method: 'POST',
    body: params,
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

// 报废
export function chipScrapped(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-poor-inspection/scrapped`, {
    method: 'POST',
    body: params,
  });
}

export async function checkMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/prod-line-verify`, {
    method: 'GET',
    query: params,
  });
}