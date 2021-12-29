/*
 * @Description: 容器转移
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-18 15:22:09
 * @LastEditTime: 2020-09-24 19:33:14
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

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

// 查询未出站的条码
export async function fetchSiteInCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/site-in-material-code-query`, {
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

// 查询容器信息
export async function fetchContainerInfo(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/container-info-query`, {
    method: 'GET',
    query: params,
  });
}

// 获取工单来料芯片数、剩余芯片数量
export async function fetchCosNumRemainingNum(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/cosnum`, {
    method: 'GET',
    query: params,
  });
}

// 创建来料信息-左上角工单
export async function createWoIncomingRecord(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/add/incoming`, {
    method: 'POST',
    body: params,
  });
}

// 获取工单数据
export async function fetchWoIncomingRecord(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/worklist`, {
    method: 'GET',
    query: params,
  });
}

// 扫描条码
export async function scaneMaterialCode(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/in-site-transfer`, {
    method: 'POST',
    body: params,
  });
}

// 扫描目标条码
export async function targetScaneMaterialCode(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/in-site-target`, {
    method: 'POST',
    body: params,
  });
}

// 出站，点击保存按钮
export async function bindMaterialWo(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/siteout/materiallot`, {
    method: 'POST',
    body: params,
  });
}

// 不良确认
export async function ncLoad(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/nc/load`, {
    method: 'POST',
    body: params.arr,
  });
}

// 不良取消
export async function deleteNcLoad(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/delete/ncload`, {
    method: 'POST',
    body: params.arr,
  });
}

// 转移芯片
export async function moveChip(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/handle-all-transfer`, {
    method: 'POST',
    body: params,
  });
}

// 自动分配
export async function autoAssignTransfer(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/auto-assign-transfer`, {
    method: 'POST',
    body: params,
  });
}

// 不良自动分配
export async function autoAssignTransferNc(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/auto-ng-assign-transfer`, {
    method: 'POST',
    body: params,
  });
}

// 转移完成
export async function moveOver(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-transfer/handle-chip-transfer-complete`, {
    method: 'POST',
    body: params,
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace`, {
    method: 'POST',
    body: params,
  });
}
export function checkEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/list-for-sn`, {
    method: 'GET',
    query: params,
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
