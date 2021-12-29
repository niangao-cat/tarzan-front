/*
 * @Description: cos检验平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-27 14:14:38
 * @LastEditTime: 2020-09-29 11:44:12
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-21572';

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
  return request(`/mes/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

// 扫描盒子
export async function chipNcRecordSiteIn(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-inspect-platform/scan-materialLotCode`, {
    method: 'GET',
    query: params,
  });
}

// 初始化查询
export async function autoQueryInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-inspect-platform/auto-query-info`, {
    method: 'GET',
    query: params,
  });
}

// 查询装载数据
export async function queryLoadData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-inspect-platform/query-load-data`, {
    method: 'GET',
    query: params,
  });
}

// 查询数据采集
export async function queryDataInspection(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-inspect-platform/cos-inspection-query`, {
    method: 'POST',
    body: params,
  });
}

export function addDataRecordBatch(params) {
  return request(`/mes/v1/${tenantId}/hme-eo-job-data-record/batch-save`, {
    method: 'POST',
    body: params,
  });
}

export async function addDataRecord(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-inspect-platform/cos-inspection`, {
    method: 'POST',
    body: params,
  });
}

export function deleteAddDataRecordList(params) {
  return request(`/mes/v1/${tenantId}/hme-eo-job-data-record/delete-supplement-record`, {
    method: 'POST',
    body: params,
  });
}

export function checkComplete(params) {
  return request(`/mes/v1/${tenantId}/hme-cos-inspect-platform/check-site-out`, {
    method: 'POST',
    body: params,
  });
}

export function checkCompleteOutSite(params) {
  return request(`/mes/v1/${tenantId}/hme-cos-inspect-platform/site-out`, {
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
