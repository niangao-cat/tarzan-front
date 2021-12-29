import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchWorkCellInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite() {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function fetchRuleList(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/${params.materialId}`, {
    method: 'GET',
    query: params,
  });
}

export function scanBarcode(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/scan-container-barcode`, {
    method: 'GET',
    query: params,
  });
}

export function filterConfirm(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/pump-pre-selection-confirm`, {
    method: 'POST',
    body: params,
  });
}

export function fetchRecallBarcode(params) {
  const newParams = parseParameters(params);
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/pump-pre-selection-recall-query`, {
    method: 'GET',
    query: newParams,
  });
}

export function recall(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/pump-pre-selection-recall`, {
    method: 'POST',
    body: params,
  });
}

export function filterPump(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections`, {
    method: 'POST',
    body: params,
  });
}

export function fetchBarcodeByLot(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/scan-selection-lot`, {
    method: 'GET',
    query: params,
  });
}

export function fetchSetNumInfoByLot(params) {
  return request(`/mes/v1/${tenantId}/hme-pump-pre-selections/sets-num-query/${params.selectionLot}`, {
    method: 'GET',
  });
}