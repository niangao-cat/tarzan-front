/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description产品组维护
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询头信息
 * @param params GET /v1/{organizationId}/hme-production-groups
 * @returns {Promise<void>}
 */
export async function queryHeadData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-production-groups`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存头信息
 * @param params POST /v1/{organizationId}/hme-production-groups
 * @returns {Promise<void>}
 */
export async function saveHeadData(params) {
  return request(`${prefix}/${organizationId}/hme-production-groups`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  查询行信息
 * @param params GET /v1/{organizationId}/hme-production-groups/line/{productionGroupId}
 * @returns {Promise<void>}
 */
export async function queryLineData(params) {
  return request(`${prefix}/${organizationId}/hme-production-groups/line/${params.productionGroupId}`, {
    method: 'GET',
    params,
  });
}

/**
 *  保存行信息
 * @param params POST /v1/{organizationId}/hme-production-groups/line
 * @returns {Promise<void>}
 */
export async function saveLineData(params) {
  return request(`${prefix}/${organizationId}/hme-production-groups/line`, {
    method: 'POST',
    body: params,
  });
}

// 获取默认站点
export function fetchDefaultSite () {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: params,
  });
}

