import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询站点表格数据
 * @async
 * @function fetchSiteList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSiteList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-site/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 站点保存
 * @async
 * @function saveSite
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-site/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询单行详细数据
 * @async
 * @function fetchSiteLineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSiteLineList(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-site/record/query/ui`, {
    method: 'GET',
    query: params,
  });
}
