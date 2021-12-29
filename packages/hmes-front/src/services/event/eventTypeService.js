import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询事件类型列表数据
 * @async
 * @function fetchEventTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchEventTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-type/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 事件类型保存
 * @async
 * @function saveEventType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveEventType(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-type/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询对象类型数据
 * @async
 * @function fetchObjectTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchObjectTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-object-type-rel/limit-id/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 对象类型保存
 * @async
 * @function saveObjectType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveObjectType(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-object-type-rel/save/object-type/ui`, {
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
