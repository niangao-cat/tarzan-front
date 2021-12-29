/**
 * @Author:wxy
 * @email: xinyu.wang02@hand-china.com
 * @description： 计划达成率报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-24623/v1`;
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
  return request(`${ReportHost}/v1/${organizationId}/hme-plan-rate-report/query`, {
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
  return request(`${prefix}/${organizationId}/hme-pro-line-details/query-product-eo-list`, {
    method: 'GET',
    query,
  });
}

/**
 * @description: 查询实际投产
 * @param {*} params
 * @returns {Promise<void>}
 */
export async function fetchAelivery(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-plan-rate-report/detail`, {
    method: 'GET',
    query,
  });
}

/**
 * @description: 查询实际交付
 * @param {*} params
 * @returns {Promise<void>}
 */
export async function fetchFinish(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-plan-rate-report/detail-delivery`, {
    method: 'GET',
    query,
  });
}

export async function handleExport(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-plan-rate-report/query-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}
