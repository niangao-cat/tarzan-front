import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
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
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs`, {
    method: 'GET',
    query: newParams,
  });
}


export function saveHeadList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs`, {
    method: 'POST',
    body: params,
  });
}

export function fetchBatchMaterialList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/material-by-group/${params.itemGroupId}`, {
    method: 'GET',
  });
}

export function fetchBatchProdLineList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/prodline-by-area/${params.areaId}`, {
    method: 'GET',
  });
}

export function fetchBatchWorkcellList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/workcell-by-prodline/${params.prodLineId}`, {
    method: 'GET',
  });
}

export function fetchRangeList (params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/range`, {
    method: 'GET',
    query: newParams,
  });
}

export function deleteRangeList (params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/delete/range`, {
    method: 'POST',
    body: params,
  });
}

export function saveRangeList (params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/add/range`, {
    method: 'POST',
    body: params,
  });
}


export function closeValidate(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/closed-validate`, {
    method: 'POST',
    body: params,
  });
}

export function close(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/closed`, {
    method: 'POST',
    body: params,
  });
}

export function completeValidate(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/completed-validate`, {
    method: 'POST',
    body: params,
  });
}

export function complete(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/completed`, {
    method: 'POST',
    body: params,
  });
}

export function release(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/released`, {
    method: 'POST',
    body: params,
  });
}

export function fetchInventoryDetail(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/detail/query`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchInventorySummaryList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/sum/query`, {
    method: 'GET',
    query: newParams,
  });
}


export function fetchMaterialList(params) {
  const newParams = parseParameters(params);
  return request(`${ReportHost}/v1/${tenantId}/hme-wip-stocktake-docs/release-detail`, {
    method: 'GET',
    query: newParams,
  });
}

export function updateHeadList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-wip-stocktake-docs/update`, {
    method: 'POST',
    body: params,
  });
}
