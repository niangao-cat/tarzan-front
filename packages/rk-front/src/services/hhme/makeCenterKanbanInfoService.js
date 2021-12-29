/**
 * @author:lly
 * @email:liyuan.liu@hand-china.com
 * @description:制造中心看板信息维护
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询头信息
 * @param params GET /v1/{organizationId}/hme-center-kanban-headers
 * @returns {Promise<void>}
 */
export async function queryHeadData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-center-kanban-headers`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存头信息
 * @param params POST /v1/{organizationId}/hme-center-kanban-headers
 * @returns {Promise<void>}
 */
export async function saveHeadData(params) {
  return request(`${prefix}/${organizationId}/hme-center-kanban-headers`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  查询行信息
 * @param params GET /v1/{organizationId}/hme-center-kanban-headers/{centerKanbanHeaderId}
 * @returns {Promise<void>}
 */
export async function queryLineData(params) {
  return request(`${prefix}/${organizationId}/hme-center-kanban-headers/${params.centerKanbanHeaderId}`, {
    method: 'GET',
    params,
  });
}

/**
 *  保存行信息
 * @param params POST /v1/{organizationId}/hme-center-kanban-headers/line
 * @returns {Promise<void>}
 */
export async function saveLineData(params) {
  return request(`${prefix}/${organizationId}/hme-center-kanban-headers/line`, {
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

