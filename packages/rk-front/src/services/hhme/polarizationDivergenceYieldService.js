import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-tag-pass-rate-headers/query-pass-rate-header`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-tag-pass-rate-lines/query-pass-rate-line`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-tag-pass-rate-header-and-line-hiss/query-header-line-his`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeaderList(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-pass-rate-headers/save-pass-rate-header`, {
    method: 'POST',
    body: params,
  });
}

export async function saveLineList(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-pass-rate-lines/save-pass-rate-line`, {
    method: 'POST',
    body: params,
  });
}
