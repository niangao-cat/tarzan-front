/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 生产执行全过程监控报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 * 获取默认站点列表
 * @async
 * @function fetchDefaultSite
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export function fetchDefaultSite () {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/production-execution-whole-process-monitoring-report/list`, {
    method: 'GET',
    query,
  });
}

// 事业部查询
export async function fetchDepartmentList(params) {
  return request(`${Host}/v1/${organizationId}/hme-equipment-monitor/department`, {
    method: 'GET',
    query: params,
  });
}

