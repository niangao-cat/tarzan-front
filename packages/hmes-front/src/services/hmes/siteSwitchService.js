import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 获取默认站点列表
 * @async
 * @function fetchDefaultSite
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchDefaultSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-user-organization/user/default/site/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询用户可选站点
 * @async
 * @function fetchSiteOptions
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSiteOptions(params) {
  return request(`${Host}/v1/${tenantId}/mt-user-organization/user/site/list/ui`, {
    method: 'GET',
    query: params,
  });
}
