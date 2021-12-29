import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询用户权限数据
 * @async
 * @function fetchUserRightsList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchUserRightsList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-user-organization/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 用户权限保存
 * @async
 * @function saveUserRights
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveUserRights(params) {
  return request(`${Host}/v1/${tenantId}/mt-user-organization/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询组织层级下拉框数据
 * @async
 * @function fetchOrganizationTypeList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchOrganizationTypeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询单据授权表
 * @async
 * @function fetchDocPrivilegeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 */
export async function fetchDocPrivilegeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-doc-privileges/query`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存单据授权表
 * @async
 * @function saveDocPrivilege
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveDocPrivilege(params) {
  return request(`${Host}//v1/${tenantId}/wms-doc-privileges/save`, {
    method: 'POST',
    body: params,
  });
}

