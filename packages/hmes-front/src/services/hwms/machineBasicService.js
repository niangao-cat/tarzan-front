/**
 * 机台基础数据维护
 *@date：2019/11/1
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-25752/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  基础数据查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/equipment-relation/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  历史数据查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHistoryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/equipment-relation/queryHis`, {
    method: 'GET',
    query,
  });
}

/**
 *  创建机台基础数据
 * @param params
 * @returns {Promise<void>}
 */
export async function create(params) {
  return request(`${prefix}/${organizationId}/equipment-relation/create`, {
    method: 'POST',
    body: { ...params },
  });
}
/**
 *  失效按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateN(params) {
  return request(`${prefix}/${organizationId}/equipment-relation/updateN`, {
    method: 'PUT',
    body: [...params],
  });
}

/**
 *  启用按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateY(params) {
  return request(`${prefix}/${organizationId}/equipment-relation/updateY`, {
    method: 'PUT',
    body: [...params],
  });
}

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/Material-get-return/get/site`, {
    method: 'GET',
  });
}
