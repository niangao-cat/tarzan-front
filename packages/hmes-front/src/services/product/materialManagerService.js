import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 物料维护查询
 * @async
 * @function fetchMaterialList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchMaterialList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-material/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 物料维护查询
 * @async
 * @function saveMaterial
 * @param {object} params - 保存数据
 * @returns {object} fetch Promise
 */
export async function saveMaterial(params) {
  return request(`${Host}/v1/${tenantId}/mt-material/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 物料维护查询
 * @async
 * @function fetchSingleMaterial
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSingleMaterial(params) {
  return request(`${Host}/v1/${tenantId}/mt-material/property/ui`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 物料校验
 * @async
 * @function checkMaterial
 * @param {object} params - 校验数据
 * @returns {object} fetch Promise
 */
export async function checkMaterial(params) {
  return request(`${Host}/v1/${tenantId}/mt-material/check/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 物料站点查询
 * @async
 * @function materialSitesList
 * @param {object} params - 校验数据
 * @returns {object} fetch Promise
 */
//
export async function materialSitesList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-material-site/site/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 物料站点删除
 * @async
 * @function materialSitesDelete
 * @param {object} params - 删除数据
 * @returns {object} fetch Promise
 */
export async function materialSitesDelete(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-site/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 物料扩展属性查询
 * @async
 * @function fetchSitesDispatch
 * @param {object} params - 校验数据
 * @returns {object} fetch Promise
 */
//
export async function fetchAttr(params) {
  return request(`${Host}/v1/${tenantId}/mt-material/attr/query/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 物料站点类别分配查询
 * @async
 * @function fetchSitesDispatch
 * @param {object} params - 校验数据
 * @returns {object} fetch Promise
 */
export async function fetchSitesDispatch(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-material-category-assign/assign/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 物料站点分配类别删除
 * @async
 * @function deleteSitesDispatch
 * @param {object} params - 删除数据
 * @returns {object} fetch Promise
 */
export async function deleteSitesDispatch(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category-assign/remove/ui`, {
    method: 'POST',
    body: params,
  });
}
