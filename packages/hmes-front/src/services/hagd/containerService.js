/**
 * @date 2019-12-4
 * @author xubiting <biting.xu@hand-china.com>
 */
import request from '@/utils/request';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-27947';

/**
 * 查询容器列表
 * @async
 * @function fetchContainerList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.page = 0] - 数据页码
 * @returns {object} fetch promise
 */
export async function fetchContainerList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-container-type/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询容器列表详细信息
 * @async
 * @function fetchContainerItem
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.page = 0] - 数据页码
 * @returns {object} fetch promise
 */

export async function fetchContainerItem(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-container-type/detail/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 容器数据保存
 * @async
 * @function saveContainerItem
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveContainerItem(params) {
  return request(`${Host}/v1/${tenantId}/mt-container-type/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// 获取扩展属性
export async function fetchExtendedAttributes(params = {}) {
  return request(`${Host}/v1/${tenantId}/hme-container-capacitys/query-container-capacity`, {
    method: 'GET',
    query: params,
  });
}

// 保存扩展属性
export async function saveExtendedAttributes(params) {
  return request(`${Host}/v1/${tenantId}/mt-container-type/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// 删除拓展属性
export async function deleteData(params) {
  return request(`${Host}/v1/${tenantId}/hme-container-capacitys/delete-container-capacity`, {
    method: 'DELETE',
    body: params,
  });
}

