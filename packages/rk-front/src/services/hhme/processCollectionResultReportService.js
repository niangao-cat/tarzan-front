import request from '@/utils/request';
import {
  getCurrentOrganizationId,
  parseParameters,
} from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `/mes`;

export function fetchList (params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-report/mes-report/process-gather-result`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${prefix}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: params,
  });
}
