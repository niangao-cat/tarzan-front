/**
 * 库存调拨审核设置
 *@date：2019/10/18
 *@version：0.0.1
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-25444/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = parseParameters(params);
  return request(`${prefix}/${organizationId}/wms-stock-allocate-settings/list/ui`, {
    method: 'GET',
    query,
  });
}

/**
 * 保存数据
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  const query = parseParameters(params);
  return request(`${prefix}/${params.tenantId}/wms-stock-allocate-settings/save/ui`, {
    method: 'POST',
    query,
  });
}

/**
 * 删除数据
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteData(params) {
  return request(`${prefix}/${params.tenantId}/wms-stock-allocate-settings`, {
    method: 'DELETE',
    body: params,
  });
}

