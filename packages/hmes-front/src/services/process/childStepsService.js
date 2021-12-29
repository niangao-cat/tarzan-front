import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 子步骤列表查询
 * @async
 * @function fetchChilStepsList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchChilStepsList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-substep/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 子步骤列表新增
 * @async
 * @function saveChildStepsList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveChildStepsList(params) {
  return request(`${Host}/v1/${tenantId}/mt-substep/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 子步骤列表删除
 * @async
 * @function deleteChildStepsList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteChildStepsList(params) {
  return request(`${Host}/v1/${tenantId}/mt-substep/remove/ui`, {
    method: 'POST',
    body: Number(params),
  });
}

/**
 * 子步骤下拉查询
 * @async
 * @function fetchSelectOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSelectOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 子步骤站点下拉查询
 * @async
 * @function fetchSiteOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSiteOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-site/limit-user/list/ui`, {
    method: 'GET',
    query: params,
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
