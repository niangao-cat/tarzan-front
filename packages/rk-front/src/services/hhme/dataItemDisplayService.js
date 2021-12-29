import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

export async function fetchAreaList() {
  return request(`${Host}/v1/${organizationId}/mt-work-order-management/wo-department`, {
    method: 'GET',
  });
}

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/tag-check-rule-headers/list`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/tag-check-rule-headers/query-line-id`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveHeaderData(params) {
  return request(`${Host}/v1/${organizationId}/tag-check-rule-headers/save`, {
    method: 'POST',
    body: params,
  });
}

export async function saveLineData(params) {
  return request(`${Host}/v1/${organizationId}/tag-check-rule-lines/save`, {
    method: 'POST',
    body: params,
  });
}