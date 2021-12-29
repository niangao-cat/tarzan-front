import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export function fetchDefaultSite () {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function fetchProdLineTree(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/prodLine/query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchInspectionList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pqc/list/query`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchProcessTree(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/process/query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchPqcInfo(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pqc/info/query`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchResultList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pqc/result/query`, {
    method: 'GET',
    query: newParams,
  });
}

export function createPqc(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pgc/create`, {
    method: 'POST',
    body: params,
  });
}

export function saveInfo(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pgc/save`, {
    method: 'POST',
    body: params,
  });
}

export function submitPqc(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pgc/submit`, {
    method: 'POST',
    body: params,
  });
}

export function uploadFile(params) {
  return request(`${Host}/v1/${tenantId}/qms-pqc-headers/pgc/upload`, {
    method: 'POST',
    body: params,
  });
}

