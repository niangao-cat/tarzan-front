// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import request from '../../utils/request';
import { Host } from '../../utils/config';

// const Host = '/mes-24520';

const tenantId = getCurrentOrganizationId();

/**
 * 查询API列表
 * @async
 * @function fetchTagList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTagList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag/query/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchSingleDetail(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag/detail/ui`, {
    method: 'GET',
    query: params,
  });
}
/**
 * API保存
 * @async
 * @function saveAPI
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveTag(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag/save/ui`, {
    method: 'POST',
    body: params,
  });
}
export async function copyTag(params) {
  return request(`${Host}/v1/${tenantId}/mt-tag/copy/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * API删除
 * @async
 * @function fetchTagHistory
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchTagHistory(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-tag-his/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * @description: 获取数据采集项
 * @param {type} params
 * @returns {object} fetch Promise
 */
export async function fetchDataCollection(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-daq-attrs`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 保存数据采集
 * @param {type} params
 * @returns {object} fetch Promise
 */
export async function saveDataCollection(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-daq-attrs/submit`, {
    method: 'POST',
    body: params,
  });
}
