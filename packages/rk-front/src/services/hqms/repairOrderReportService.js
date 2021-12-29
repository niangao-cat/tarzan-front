import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const organizationId = getCurrentOrganizationId();

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchList(params) {
  const query = parseParameters(params);
  return request(`${ReportHost}/v1/${organizationId}/repair-order`, {
    method: 'GET',
    query,
  });
}

// 获取默认工厂
export async function fetchDefaultSite(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
