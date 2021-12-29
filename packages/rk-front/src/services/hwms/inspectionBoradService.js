/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 巡检报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';

const prefix = `${ReportHost}/v1`;
// const prefix = `/mes-24520/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/qms-pqc-report/head/mes-report`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询折线数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/qms-pqc-report/echart/mes-report`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询报表明细数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDetailList(params) {
    const query = filterNullValueObject(parseParameters(params));
    return request(`${prefix}/${organizationId}/qms-pqc-report/detail/mes-report`, {
      method: 'GET',
      query,
    });
  }
