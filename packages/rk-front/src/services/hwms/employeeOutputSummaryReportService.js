/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 员工产量汇总报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host, ReportHost } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const param = filterNullValueObject(parseParameters(params));
    return request(`${ReportHost}/v1/${organizationId}/hme-employee-export/sum`, {
    method: 'GET',
    query: param,
  });
}

export function fetchDefaultSite () {
  return request(`${prefix}/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 产量明细查询
export async function fetchmakeNumList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${ReportHost}/v1/${organizationId}/hme-employee-export/summarys-detail`, {
    method: 'GET',
    query,
  });
}