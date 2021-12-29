/*
 * @Description: service
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-05 17:33:49
 * @LastEditTime: 2021-03-17 10:14:34
 */
import request from '@/utils/request';
// import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const Host = '/mes';

const tenantId = getCurrentOrganizationId();

/**
 * 工位编码查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchWorkCellInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/wkc-scan`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function scanBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/sn-scan`, {
    method: 'POST',
    body: params,
  });
}

export function fetchMaterialInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/material-lot-scan`, {
    method: 'GET',
    query: params,
  });
}

export function save(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/split`, {
    method: 'POST',
    body: params,
  });
}

export function fetchBom(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/bom`, {
    method: 'GET',
    query: params,
  });
}

export function fetchReturnTestData(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/return-check`, {
    method: 'GET',
    query: params,
  });
}

export async function handlePrintCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-mt-eo/print/${params.type}`, {
    method: 'POST',
    body: params.arr,
    responseType: 'blob',
  });
}
// 登记撤销
export function cancel(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-split-records/cancel`, {
    method: 'POST',
    body: params,
  });
}
// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
