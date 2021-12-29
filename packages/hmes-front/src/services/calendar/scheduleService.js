import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询类型列表数据
 * @async
 * @function fetchTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-shift/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 类型保存
 * @async
 * @function saveType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveType(params) {
  return request(`${Host}/v1/${tenantId}/mt-shift/save/ui`, {
    method: 'POST',
    body: params,
  });
}
