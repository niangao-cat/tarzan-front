import request from '@/utils/request';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 列表查询
 * @async
 * @function fetchTableList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTableList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 列表新增
 * @async
 * @function saveList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveList(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除
 * @async
 * @function deleteChildStepsList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteItem(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/delete/ui`, {
    method: 'POST',
    body: Object.values(params)[0],
  });
}
