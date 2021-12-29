import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-exception/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeadList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exception/save/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-exception-router/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveLineList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exception-router/save/ui`, {
    method: 'POST',
    body: params.data,
  });
}

export async function deleteLineList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-exception-router/delete/ui`, {
    method: 'POST',
    body: params.data,
  });
}

export async function fetchExceptionTypeList(params) {
  return request(`${prefix}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
