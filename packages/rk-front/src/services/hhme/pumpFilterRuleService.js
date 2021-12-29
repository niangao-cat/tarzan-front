import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-pump-filter-rule-headers`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-pump-filter-rule-headers/rule-line-list`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-pump-filter-rule-headers/rule-history-list`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeaderList(params) {
  return request(`${Host}/v1/${tenantId}/hme-pump-filter-rule-headers/save-rule-header`, {
    method: 'POST',
    body: params,
  });
}

export async function saveLineList(params) {
  return request(`${Host}/v1/${tenantId}/hme-pump-filter-rule-lines/save-rule-line`, {
    method: 'POST',
    body: params,
  });
}