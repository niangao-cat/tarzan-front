/*
 * @Description: 时效管理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-19 16:40:28
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-4279';
// const Host = '/mes-17823';
const organizationId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 工位输入
export async function enterSite(params) {
  return request(`/mes/v1/${organizationId}/hme-eo-job-sn/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 获取指定工位未出站时效工序作业
export async function fetchListTimeSn(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn/list-for-time-sn/page`, {
    method: 'GET',
    query: params,
  });
}

// 入炉扫描
export async function scanningInFurnaceCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn/time-sn-scan`, {
    method: 'GET',
    query: params,
  });
}

// 入炉操作
export async function addInFurnace(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/in-site-scan`, {
    method: 'POST',
    body: params,
  });
}

// 出炉扫描
export async function scanningOutFurnaceCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn/time-sn-scan`, {
    method: 'GET',
    query: params,
  });
}

// 出炉操作
export async function addOutFurnace(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/out-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function handleContinueRework(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/continue-rework`, {
    method: 'POST',
    body: params,
  });
}

// 数据采集查询
export async function fetchDataCollection(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/eo-job-data-record/page`, {
    method: 'GET',
    query: params,
  });
}

export async function saveDataCollection(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/eo-job-data-record/save`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchDefaultData(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn-time/default-data-tag/query`, {
    method: 'POST',
    body: params,
  });
}

export async function handleFetchSnList(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn/time-not-in-station-sn-list`, {
    method: 'GET',
    query: params,
  });
}

export function fetchESopList(params) {
  const pageParams = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/hme-operation-ins-heads/esop-query`, {
    method: 'GET',
    query: pageParams,
  });
}

export function fetchEquipmentList(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/replace`, {
    method: 'POST',
    body: params,
  });
}
export function checkEq(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-sn/list-for-sn`, {
    method: 'GET',
    query: params,
  });
}
export function deleteEq(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/unbinding`, {
    method: 'DELETE',
    body: params,
  });
}

export function bindingEq(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/binding`, {
    method: 'POST',
    body: params,
  });
}

export function fetchEqInfo(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/${params.eqCode}`, {
    method: 'GET',
    responseType: 'text',
  });
}
export function bindingEqConfirm(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/binding/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function changeEqConfirm(params) {
  return request(`${Host}/v1/${organizationId}/hme-workcell-equipment-switch/replace/confirm`, {
    method: 'POST',
    body: params,
  });
}

