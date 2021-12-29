import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { Host } from '../../utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
// import { from } from 'rxjs';

const tenantId = getCurrentOrganizationId();

/**
 * 查询对象类型列表数据
 * @async
 * @function fetchObjectTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchObjectTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-object-type/limit-property/list/ui`, {
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
  return request(`${Host}/v1/${tenantId}/mt-event-object-type/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 对象类型删除
 * @async
 * @function deleteObjectType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteObjectType(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-object-type/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 对象类型展示列保存
 * @async
 * @function saveTable
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveTable(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-object-column/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 对象类型展示列删除
 * @async
 * @function deleteObjectColumn
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteObjectColumn(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-object-column/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询对象展示列列表数据
 * @async
 * @function fetchTableList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 1] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTableList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-object-column/limit-property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 获取展示列类型
 * @async
 * @function fetchColumnType
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchColumnType() {
  // const param = parseParameters(params);
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=EVENT&typeGroup=OBJECT_COLUMN_TYPE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 查询对象列表sql语句
 * @async
 * @function queryObjectTypeSQL
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function queryObjectTypeSQL(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-object-type/query-sql/ui`, {
    method: 'GET',
    query: param,
  });
}
