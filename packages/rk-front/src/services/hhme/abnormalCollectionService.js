import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-exception-group/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function save(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exception-group/save/ui`, {
    method: 'POST',
    body: params.data,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-exc-group-router/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function deleteLineList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exc-group-router/delete/ui`, {
    method: 'POST',
    body: params.data,
  });
}

export async function fetchOldLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-exception-router/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchExceptionCodeList(params) {
  return request(`${prefix}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

export async function deleteProcess(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exc-group-wkc-assign/delete/ui`, {
    method: 'POST',
    body: params,
  });
}
