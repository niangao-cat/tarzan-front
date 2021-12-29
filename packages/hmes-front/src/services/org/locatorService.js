import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询库位表格数据
 * @async
 * @function fetchLocatorList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchLocatorList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-locator/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 库位保存
 * @async
 * @function saveLocator
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveLocator(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-locator/save/ui`, {
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
 * @function fetchLocatorLineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchLocatorLineList(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-locator/detail/ui`, {
    method: 'GET',
    query: params,
  });
}
