import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-eq-manage-task-doc/list`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-eq-manage-task-doc/line-list`, {
    method: 'GET',
    query: newParams,
  });
}

// 更新行
export async function updateLine(params) {
  return request(`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updateHeadLine(params) {
  return request(`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/update-task-doc`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchHistoryList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-eq-manage-task-doc/task-history-list-query`, {
    method: 'GET',
    query: newParams,
  });
}
