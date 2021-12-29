/**
 * 物流器具查询
 *@date：2019/9/12
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-24233/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  物流器具头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeaderList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-container/containerHeaderQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  物流器具头历史列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeaderHisList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-container/containerHeaderHis`, {
    method: 'GET',
    query,
  });
}

/**
 *  物流器具行列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-container/containerLineQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  物流器具行历史列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineHisList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-container/containerLineHis`, {
    method: 'GET',
    query,
  });
}

/**
 * 物流器具创建
 * @param params
 * @returns {Promise<void>}
 */
export async function createData(params) {
  return request(`${prefix}/${params.tenantId}/wms-container/save`, {
    method: 'POST',
    body: { ...params },
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 打印
export async function print(params) {
  return request(`${Host}/v1/${organizationId}/wms-container/containerCodePrint/${params.type}`, {
    method: 'POST',
    body: params.materialLotCodeList,
    responseType: 'blob',
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}
