/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 芯片性能表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';

const organizationId = getCurrentOrganizationId();

/**
 *  查询头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-functions/cosfunction/headquery`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-functions/cosFunction/query`, {
    method: 'GET',
    query,
  });
}

