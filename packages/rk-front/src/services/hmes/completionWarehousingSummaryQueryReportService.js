/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 完工及入库汇总查询报表
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
  return request(`${prefix}/${organizationId}/finish-warehouse/query-summary`, {
    method: 'GET',
    query,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}

// 工厂信息
export async function fetchSite() {
  return request(`${Host}/v1/${organizationId}/pc-material-lot/property`, {
    method: 'GET',
  });
}

// 制造部信息
export async function fetchDivisionList(params) {
  return request(`${Host}/v1/${organizationId}/hme-equipment-monitor/department`, {
    method: 'GET',
    query: params,
  });
}

// 导出
export async function exportExcel(params) {
  return request(`${prefix}/${organizationId}/finish-warehouse/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

