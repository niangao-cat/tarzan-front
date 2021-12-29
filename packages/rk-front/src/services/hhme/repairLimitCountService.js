import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 查询事业部
export async function fetchDepartment(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-repair-limit-count/list`, {
    method: 'Get',
    query: param,
  });
}

export async function deleteLimitCount(params) {
  return request(`${Host}/v1/${tenantId}/hme-repair-limit-count/delete`, {
    method: 'DELETE',
    body: params.arr,
  });
}

export async function saveLimitCount(params) {
  return request(`${Host}/v1/${tenantId}/hme-repair-limit-count/createOrUpdate`, {
    method: 'POST',
    body: params.arr,
  });
}

export async function fetchHisRecord(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-repair-limit-count-his/list`, {
    method: 'Get',
    query: param,
  });
}


