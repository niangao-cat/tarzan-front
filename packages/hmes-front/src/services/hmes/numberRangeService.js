import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询号码段表格数据
 * @async
 * @function fetchNumberRangeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchNumberRangeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange/list/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询号码段详细数据
 * @async
 * @function fetchNumberRangeLineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchNumberRangeLineList(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange/one/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 号码段保存
 * @async
 * @function saveNumberRange
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveNumberRange(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询修改历史数据
 * @async
 * @function fetchHistoryList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchHistoryList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-his/his-list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询修改历史次表数据
 * @async
 * @function fetchHistoryItemList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchHistoryItemList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-rule-his/his-list/ui`, {
    method: 'GET',
    query: param,
  });
}
