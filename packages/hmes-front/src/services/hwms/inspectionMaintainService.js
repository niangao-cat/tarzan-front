/**
 * 货柜检查表维护
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-25444/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询已维护的货柜检查表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/container-inspection/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  数据保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(`${prefix}/${organizationId}/container-inspection/save`, {
    method: 'POST',
    body: params.dtoList,
  });
}

/**
 *  删除数据
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteData(params) {
  return request(`${prefix}/${organizationId}/container-inspection/delete`, {
    method: 'DELETE',
    body: params.dtoList,
  });
}
