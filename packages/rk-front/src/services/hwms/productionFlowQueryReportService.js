/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产流转查询报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  const { page, size } = query;
  return request(`${ReportHost}/v1/${organizationId}/hme-production-flow`, {
    method: 'POST',
    body: query,
    query: {page, size},
  });
}

// 获取不良信息
export async function fetchNcList(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-trace-back/nc`, {
    method: 'GET',
    query: params,
  });
}

export function fetchDefaultSite () {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
