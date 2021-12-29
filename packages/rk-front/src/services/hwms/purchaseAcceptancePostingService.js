import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-material-posting`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchDetail(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-material-posting/detail`, {
    method: 'GET',
    query: newParams,
  });
}

export async function handlePost(params) {
  return request(`${prefix}/v1/${tenantId}/wms-material-posting/execute-posting`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite () {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export async function fetchPoInfo(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-material-posting/po`, {
    method: 'GET',
    query: newParams,
  });
}
