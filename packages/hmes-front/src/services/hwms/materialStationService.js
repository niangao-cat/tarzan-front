/**
 * 料站表维护
 *@date：2019/11/5
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
  return request(`${prefix}/${organizationId}/material-station-table-heads/queryHead`, {
    method: 'GET',
    query,
  });
}

/**
 *  明细数据查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/material-station-table-heads/queryLine`, {
    method: 'GET',
    query,
  });
}

/**
 *  创建头数据
 * @param params
 * @returns {Promise<void>}
 */
export async function createHeadData(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/createHead`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 *  创建行数据
 * @param params
 * @returns {Promise<void>}
 */
export async function createLineData(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/createLine`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 *  头失效按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateHeadN(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/updateHeadN`, {
    method: 'PUT',
    body: [...params],
  });
}

/**
 *  头启用按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateHeadY(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/updateHeadY`, {
    method: 'PUT',
    body: [...params],
  });
}

/**
 *  行失效按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateLineN(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/updateLineN`, {
    method: 'PUT',
    body: [...params],
  });
}

/**
 *  行启用按钮
 * @param params
 * @returns {Promise<void>}
 */
export async function updateLineY(params) {
  return request(`${prefix}/${organizationId}/material-station-table-heads/updateLineY`, {
    method: 'PUT',
    body: [...params],
  });
}
