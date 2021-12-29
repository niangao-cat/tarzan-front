import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-nameplate-print-rel-headers/query-print-header`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-nameplate-print-rel-lines/query-print-line`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-nameplate-print-rel-headers/query-print-header-line`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeaderList(params) {
  return request(`${Host}/v1/${tenantId}/hme-nameplate-print-rel-headers/save-print-re-header`, {
    method: 'POST',
    body: params,
  });
}

export async function saveLineList(params) {
  return request(`${Host}/v1/${tenantId}/hme-nameplate-print-rel-lines/save-print-re-line`, {
    method: 'POST',
    body: params,
  });
}