import request from '@/utils/request';
import {
  getCurrentOrganizationId,
  parseParameters,
} from 'utils/utils';
import { ReportHost, Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

export function fetchList (params) {
  const newParams = parseParameters(params);
  return request(`${ReportHost}/v1/${tenantId}/service-return`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchDefaultSite () {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${tenantId}/site`, {
    method: 'GET',
    query: params,
  });
}
