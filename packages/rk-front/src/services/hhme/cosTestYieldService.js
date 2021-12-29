import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-test-pass-rates/query-cos-pass-rate`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-test-pass-rate-hiss/cos-test-pass-rate-his-query`, {
    method: 'GET',
    query: params,
  });
}

export async function saveHeaderList(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-test-pass-rates/save-cos-pass-rate`, {
    method: 'POST',
    body: params,
  });
}
