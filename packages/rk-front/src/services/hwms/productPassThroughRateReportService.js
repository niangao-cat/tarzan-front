/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost, Host } from '@/utils/config';

const prefix = `${ReportHost}/v1`;
const organizationId = getCurrentOrganizationId();


/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-prod-line-pass-rate`, {
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

// 查询事业部
export async function fetchDepartment(params) {
  return request(`${Host}/v1/${organizationId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}

export async function getExport(params) {
  return request(`${prefix}/${organizationId}/hme-prod-line-pass-rate/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

