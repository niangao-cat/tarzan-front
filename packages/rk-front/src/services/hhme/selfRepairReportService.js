import request from '@/utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const reportPrefix = `${ReportHost}/v1`;
const prefix = `${Host}/v1`;

const tenantId = getCurrentOrganizationId();

/**
 * 列表查询
 * @async
 * @function handleFetchList
 */
 export async function handleFetchList(params) {
  return request(`${reportPrefix}/${tenantId}/hme-self-repair/query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchDefaultSite () {
  return request(`${prefix}/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${prefix}/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: params,
  });
}
