/**
 * 待报废报表
 *@date：2019/10/18
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
 *  待报废报表列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/scrap-application/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  仓库列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryWarehouseList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/scrap-application/get/warehouse`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询工厂默认值
 * @returns {Promise<void>}
 */
export async function queryDefaultSite() {
  return request(`${prefix}/${organizationId}/scrap-application/get/site`, {
    method: 'GET',
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
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/Material-get-return/get/site`, {
    method: 'GET',
  });
}
