import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询状态表格数据
 * @async
 * @function fetchStatusList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchStatusList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-gen-status/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 状态保存
 * @async
 * @function saveStatus
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveStatus(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 状态删除
 * @async
 * @function deleteStatus
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteStatus(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询关联表数据
 * @async
 * @function fetchTableList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
// export async function fetchTableList(params) {
//   const param = parseParameters(params);
//   return request(`http://192.168.20.70:8080/hmsg/v1/2/messages/user/count`, {
//     method: 'GET',
//     query: param,
//   });
// }

// /**
//  * 关联表保存
//  * @async
//  * @function saveTable
//  * @param {object} params - 请求参数
//  * @returns {object} fetch Promise
//  */
// export async function saveTable(params) {
//   return request(`${HZERO_PLATFORM}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
//     method: 'POST',
//     body: params,
//   });
// }

// /**
//  * 关联表删除
//  * @async
//  * @function deleteTable
//  * @param {object} params - 请求参数
//  * @returns {object} fetch Promise
//  */
// export async function deleteTable(params) {
//   return request(`${HZERO_PLATFORM}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
//     method: 'DELETE',
//     body: [params],
//   });
// }
