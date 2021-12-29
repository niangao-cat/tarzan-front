/*
 * @Description: 来料录入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-13 19:26:35
 * @LastEditTime: 2020-11-23 21:54:59
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-20491';

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
  return request(`/mes/v1/${tenantId}/hme-eo-job-sn/workcell-scan`, {
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

// 查询工单详细信息
export async function fetchWorkDetails(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/work/details`, {
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
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/scan/materiallot`, {
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

export async function fetchExceptionTypeList(params) {
  return request(`${prefix}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

// 获取剩余芯片数
export async function fetchrRemainingQty(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/remaining/qty`, {
    method: 'GET',
    query: params,
  });
}

// 更改costype
export async function changeCosType(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wo-job-sn/cosnum`, {
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

// 获取工单组件
export function fetchMainMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/component`, {
    method: 'GET',
    query: params,
  });
}

export function updateWo(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/update/qty`, {
    method: 'POST',
    body: params,
  });
}

// 扫描条码带出数量
export function queryMateriallotQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/materiallot-qty-query`, {
    method: 'GET',
    query: params,
  });
}

// 物料拆分
export function materiallotSplit(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/materiallot-split`, {
    method: 'POST',
    body: params,
  });
}

// 物料WAFER拆分
export function materiallotWaferSplit(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/wafer-split`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchWorkDetailsCreate(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/materiallot-query`, {
    method: 'GET',
    query: params,
  });
}

export function handleSave(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/update-barcode-record`, {
    method: 'POST',
    body: params,
  });
}

// 查询头信息
export async function queryHeadDataList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-import-datas/head-query`, {
    method: 'GET',
    query: params,
  });
}

// 查询行信息
export async function queryLineDataList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-chip-import-datas/line-query`, {
    method: 'GET',
    query: params,
  });
}

// 打印
export async function headPrint(params) {
  return request(`${Host}/v1/${tenantId}/wms-material-log-print/print/1`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 导出
export async function exportExcel(params) {
  return request(`/mes/v1/${tenantId}/hme-wo-job-sn/incoming-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}
