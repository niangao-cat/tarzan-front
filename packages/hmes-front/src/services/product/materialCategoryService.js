/**
 * @date 2019-8-23
 * @author dong.li <dong.li04@hand-china.com>
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询物料类别数据
 * @async
 * @function fetchMaterialCategoryList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchMaterialCategoryList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-material-category/list/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询扩展字段数据
 * @async
 * @function fetchAttributeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchAttributeList(params) {
  const param = parseParameters(params);
  return request(`http://192.168.20.70:8080/hmsg/v1/2/messages/user/count`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 物料类别保存
 * @async
 * @function saveMaterialCategory
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveMaterialCategory(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 扩展字段保存
 * @async
 * @function saveAttribute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttribute(params) {
  return request(`${HZERO_PLATFORM}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 检查站点分配
 * @async
 * @function inspectSiteDistribution
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function inspectSiteDistribution(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category/verify/default-set/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 站点分配查询接口
 * @async
 * @function inspectSiteDistribution
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function querySiteDistribution(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category-site/list/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 站点分配新增更新
 * @async
 * @function addOrUpdateSite
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function addOrUpdateSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category-site/save/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 站点分配删除站点
 * @async
 * @function deleteSite
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category-site/remove/ui`, {
    method: 'POST',
    body: params,
  });
}
