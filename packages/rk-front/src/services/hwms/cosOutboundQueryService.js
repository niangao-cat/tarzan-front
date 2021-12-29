/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工位产量明细查询
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
// import { Host } from '@/utils/config';

// const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`/mes-report/v1/${organizationId}/hme-cos-wip-query/query`, {
    method: 'POST',
    body: params,
    query,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
