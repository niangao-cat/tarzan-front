import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询移动业务表格数据
 * @async
 * @function fetchBusinessTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchBusinessTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-business-instruction-type-r/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 移动业务保存
 * @async
 * @function saveBusinessType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveBusinessType(params) {
  return request(`${Host}/v1/${tenantId}/mt-business-instruction-type-r/save/ui`, {
    method: 'POST',
    body: params,
  });
}
