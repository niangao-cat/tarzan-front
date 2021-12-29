import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/material-exchange-query/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/material-exchange-query/line/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveLine(params) {
  return request(`${prefix}/v1/${tenantId}/material-exchange-query/line-stock-transfer`, {
    method: 'POST',
    body: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
