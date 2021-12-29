import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-nc-downgrades`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-nc-downgrades/his`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveData(params) {
  return request(`${Host}/v1/${tenantId}/hme-nc-downgrades`, {
    method: 'POST',
    body: params,
  });
}
