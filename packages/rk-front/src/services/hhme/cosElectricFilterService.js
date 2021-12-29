import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-selection-currents`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-selection-currents/his-query/${params.cosId}`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-selection-currents`, {
    method: 'POST',
    body: params,
  });
}
