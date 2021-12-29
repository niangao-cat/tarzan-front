// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import request from '../../utils/request';
import { Host } from '../../utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询数据收集组列表
 * @async
 * @function fetchTagList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTagList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询数据项信息
 * @async
 * @function fetchTagGroupList
 */
export async function fetchTagGroupList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group-assign/list/ui`, {
    method: 'GET',
    query: param,
  });
}
export async function synchronous(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag/detail/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 删除数据项信息
 * @async
 * @function removeTagGroupList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function removeTagGroupList(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag-group-assign/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 数据收集组保存
 * @async
 * @function saveTag
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveTag(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag-group/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 数据收集组详情
 * @async
 * @function fetchSingleTag
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchSingleTag(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group/detail/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 数据收集组复制
 * @async
 * @function copyTag
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function copyTag(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag-group/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

// 数据收集组列表历史记录
export async function fetchTagListHistory(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group-his/list/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchTagAssinHistory(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group-assign-his/list/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchObjectHistory(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-group-object-his/list/ui`, {
    method: 'GET',
    query: param,
  });
}
