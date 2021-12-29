/**
 * 呆滞物料报表
 *@date：2019/10/24
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
 *  查询呆滞物料列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/dull-material/query/list`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询需要导入的呆滞物料列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryImportList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/dull-material/import/query`, {
    method: 'GET',
    query,
  });
}

/**
 * 导入呆滞物料报表
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(`${prefix}/${organizationId}/dull-material/import/save`, {
    method: 'POST',
    body: [...params],
  });
}

/**
 *  提交审批
 * @param params
 * @returns {Promise<void>}
 */
export async function submitApprove(params) {
  return request(`${prefix}/${organizationId}/scrap-application/generate/report`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 查询当前用户的站点
 *
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
  });
}
