import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询单位数据
 * @async
 * @function fetchUomList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchUomList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-uom/limit-property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 单位保存
 * @async
 * @function saveUom
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveUom(params) {
  return request(`${Host}/v1/${tenantId}/mt-uom/save/ui`, {
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
