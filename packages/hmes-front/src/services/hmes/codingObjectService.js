import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询编码对象表格数据
 * @async
 * @function fetchCodingObjectList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchCodingObjectList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-object/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 编码对象保存
 * @async
 * @function saveCodingObject
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveCodingObject(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-object/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询对象属性数据
 * @async
 * @function fetchAttributeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchAttributeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-object-column/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 对象属性保存(单条)
 * @async
 * @function saveAttribute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttribute(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-object-column/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 对象属性保存(批量)
 * @async
 * @function saveAttribute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttributeBatch(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-object-column/batch/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取服务包下拉列表
 * @async
 * @function fetchComBoxList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchComBoxList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/module/type-group/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取编码对象下已设为类型组的对象属性id
 * @async
 * @function fetchNumrangeObjectColumn
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchNumrangeObjectColumn(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-object-column/module/column/ui`, {
    method: 'POST',
    body: params,
  });
}
