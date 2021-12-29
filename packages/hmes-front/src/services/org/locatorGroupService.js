import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询库存组列表数据
 * @async
 * @function fetchLocatorGroupList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchLocatorGroupList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 库存组列表保存
 * @async
 * @function savLocatorGroupList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function savLocatorGroupList(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询扩展字段列表数据
 * @async
 * @function featchAttrList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function featchAttrList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/attr/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 库存组列表保存
 * @async
 * @function saveAttrList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttrList(params) {
  const param = parseParameters(params);
  return request(
    `${Host}/v1/${tenantId}/mt-mod-locator-group/attr/save/ui?locatorGroupId=${param.locatorGroupId}`,
    {
      method: 'POST',
      body: param.locatorGroupAttrs,
    }
  );
}

/**
 * 查询库存组单个数据     **用于组织关系维护页面**
 * @async
 * @function fetchLocatorGroupDetails
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */

//    留一下，暂时不需要，但以后说不定

// export async function fetchLocatorGroupDetails(params) {
//   return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/one/ui`, {
//     method: 'GET',
//     query: params,
//   });
// }

/**
 * 库存信息保存         **用于组织关系维护页面**
 * @async
 * @function saveLocatorGroup
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveLocatorGroup(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/save-with-attr/ui`, {
    method: 'POST',
    body: params,
  });
}
