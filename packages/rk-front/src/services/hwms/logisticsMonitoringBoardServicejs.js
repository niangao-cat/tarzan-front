import request from 'utils/request';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';

const prefix = `${ReportHost}/v1`;
const organizationId = getCurrentOrganizationId() || 0;

/**
 * 当日配送任务查询
 * @param params
 * @returns {Promise<*>}
 */
export async function queryDailyDataQuery(params) {
  const query = filterNullValueObject(params);
  return request(`${prefix}/${organizationId}/delivery-monitoring-board/daily/data/query`, {
    method: 'GET',
    query,
  });
}

/**
 * 日产线配送任务查询
 * @param params
 * @returns {Promise<*>}
 */
export async function proLineDataQuery(params) {
  const query = filterNullValueObject(params);
  return request(`${prefix}/${organizationId}/delivery-monitoring-board/proLine/data/query`, {
    method: 'GET',
    query,
  });
}

/**
 * 没月配送任务查询
 * @param params
 * @returns {Promise<*>}
 */
export async function mouthDataQuery(params) {
  const query = filterNullValueObject(params);
  return request(`${prefix}/${organizationId}/delivery-monitoring-board/month/data/query`, {
    method: 'GET',
    query,
  });
}
