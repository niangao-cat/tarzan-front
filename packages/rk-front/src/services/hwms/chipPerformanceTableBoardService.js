/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 芯片性能表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { ReportHost, Host } from '@/utils/config';


const organizationId = getCurrentOrganizationId();

/**
 *  查询头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadData(params) {
  const query = parseParameters(params);
  const { page, size, ...body } = query;
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-functions/mes-report/function`, {
    method: 'POST',
    query: { page, size },
    body,
  });
}


/**
 *  导出
 * @param params
 * @returns {Promise<void>}
 */
export async function handleExport(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-functions/mes-report/function/export`, {
    method: 'GET',
    query: params,
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

// 获取默认工厂
export async function getDefaultSite(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  查询头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryGpHeadData(params) {
  const query = parseParameters(params);
  const { page, size, ...body } = query;
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-functions/mes-report/gp/function`, {
    method: 'POST',
    query: { page, size },
    body,
  });
}