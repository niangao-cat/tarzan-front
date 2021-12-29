// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import request from '../../utils/request';
import { Host } from '../../utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询API列表
 * @async
 * @function fetchAPIList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchAPIList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-api/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * API保存
 * @async
 * @function saveAPI
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAPI(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag-api/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * API删除
 * @async
 * @function deleteAPI
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteAPI(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag-api/delete/ui`, {
    method: 'POST',
    body: params,
  });
}
