import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchItemList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times/query/material`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchObjectList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times/query/object`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeadList(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-times`, {
    method: 'POST',
    body: params,
  });
}

export async function saveItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-times/create/update/material`, {
    method: 'POST',
    body: params,
  });
}

export async function saveObjectList(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-times/create/update/object`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchProcessHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times/query/his`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchItemHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times/query/material/his`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchObjectHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-times/query/object/his`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

