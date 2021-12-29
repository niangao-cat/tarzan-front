import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询扩展表数据
 * @async
 * @function fetchExtendTableList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchExtendTableList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-extend-table-desc/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询扩展字段表数据
 * @async
 * @function fetchExtendTableList
 * @export
 * @param {object} params - 查询条件
 * @returns
 */
export async function fetchExtendFieldList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/extends/limit-table/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function saveExtendFieldList(params) {
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/save/property/batch/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询服务包下拉框数据
 * @async
 * @function fetchServicePackageList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchServicePackageList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 扩展表保存
 * @async
 * @function saveExtendTable
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveExtendTable(params) {
  return request(`${Host}/v1/${tenantId}/mt-extend-table-desc/save/ui`, {
    method: 'POST',
    body: params,
  });
}
