import request from '@/utils/request';
import { Host } from '@/utils/config';
import {
  getCurrentOrganizationId,
  parseParameters,
} from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `/mes`;

export function fetchDefaultSite () {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function fetchList (params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc`, {
    method: 'GET',
    query: newParams,
  });
}

export function saveDoc(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc`, {
    method: 'POST',
    body: params,
  });
}

export function updateDoc(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc`, {
    method: 'PUT',
    body: params,
  });
}

export function closeStockTakeDoc(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc/close`, {
    method: 'POST',
    body: params,
  });
}

export function completeStockTakeDoc(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc/complete`, {
    method: 'POST',
    body: params,
  });
}

export function fetchIsLeak(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc/leak`, {
    method: 'POST',
    body: params,
  });
}

export function releaseStockTakeDoc(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc/release`, {
    method: 'POST',
    body: params,
  });
}

export function fetchRangeList (params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-range`, {
    method: 'GET',
    query: newParams,
  });
}

export function deleteRangeList (params) {
  const { rangeList, ...query } = params;
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-range`, {
    method: 'DELETE',
    body: rangeList,
    query,
  });
}

export function saveRangeList (params) {
  const { rangeList, ...query } = params;
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-range`, {
    method: 'POST',
    body: params.rangeList,
    query,
  });
}

export function fetchBatchItemList(params) {
  return request(`${prefix}/v1/${tenantId}/wms-material/group-onhand`, {
    method: 'GET',
    query: params,
  });
}

export function fetchBatchLocatorList(params) {
  return request(`${prefix}/v1/${tenantId}/locator/inventory-locator`, {
    method: 'GET',
    query: params,
  });
}

export function fetchBarcodeList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-actual`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchMaterialList(params) {
  const { page, ...postParams } = params;
  const newParams = parseParameters({page});
  return request(`${prefix}/v1/${tenantId}/wms-stocktake-doc/material-detail`, {
    method: 'POST',
    query: newParams,
    body: postParams,
  });
}

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
