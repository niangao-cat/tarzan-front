import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 物料生产属性列表
 * @async
 * @function fetchMaterialList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchProduceList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-pfep-manufacturing/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存物料生产属性
 * @async
 * @function saveProduce
 * @param {object} params - 保存数据
 * @returns {object} fetch Promise
 */
export async function saveProduce(params) {
  return request(`${Host}/v1/${tenantId}/mt-pfep-manufacturing/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 单条物料生产属性查询
 * @async
 * @function fetchSingleProduce
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSingleProduce(params) {
  return request(`${Host}/v1/${tenantId}/mt-pfep-manufacturing/detail/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 物料生产属性下拉查询
 * @async
 * @function fetchOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 物料生产属性校验
 * @async
 * @function checkProduceItem
 * @param {object} params - 校验数据
 * @returns {object} fetch Promise
 */
export async function checkProduceItem(params) {
  return request(`${Host}/v1/${tenantId}/mt-pfep-manufacturing/copy/ui`, {
    method: 'POST',
    body: params,
  });
}
