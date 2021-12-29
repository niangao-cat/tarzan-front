/**
 * author: ywj
 * des:不良代码指定工艺路线维护
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-20307/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs`, {
    method: 'GET',
    query,
  });
}

/**
 * 修改/新增
 * @param params
 * @returns {Promise<void>}
 */
export async function updateData(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs`, {
    method: 'PUT',
    body: params.saveData,
  });
}

/**
 * 完成校验
 * @param params
 * @returns {Promise<void>}
 */
export async function checkComplete(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs/${params.stocktakeId}/valid/complete`, {
    method: 'GET',
    query,
  });
}

/**
 * 完成
 * @param params
 * @returns {Promise<void>}
 */
export async function setComplete(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs/complete`, {
    method: 'POST',
    body: params.saveData,
  });
}


/**
 * 取消
 * @param params
 * @returns {Promise<void>}
 */
export async function setCancel(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs/cancel`, {
    method: 'POST',
    body: params.saveData,
  });
}

/**
 * 合并
 * @param params
 * @returns {Promise<void>}
 */
export async function setComcat(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-docs/complete`, {
    method: 'POST',
    body: params.saveData,
  });
}

/**
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-actuals`, {
    method: 'GET',
    query,
  });
}

/**
 * 修改/新增
 * @param params
 * @returns {Promise<void>}
 */
export async function updateLineData(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-stocktake-actuals`, {
    method: 'PUT',
    body: params.saveData,
  });
}
