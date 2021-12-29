/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost, Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${prefix}/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-pro-line-details/queryProductDetails`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询明细数据
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-pro-line-details/query-product-eo-list`, {
    method: 'GET',
    query,
  });
}

export async function handleExport(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-pro-line-details/online-report-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}
