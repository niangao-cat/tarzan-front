/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工序不良报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
// GET /v1/{organizationId}/hme-nc-detail
export async function queryDataList(params) {
  const newParams = parseParameters(params);
  return request(`/mes-report/v1/${organizationId}/hme-nc-detail`, {
    method: 'GET',
    query: newParams,
  });
}

// export async function queryDataList(params) {
//   const { page, ...newParams } = params;
//   const pageQuery = parseParameters({ page });
//   const searchQuery = filterNullValueObject(newParams);
//   return request(`${prefix}/${organizationId}/hme-nc-detail`, {
//     method: 'POST',
//     query: pageQuery,
//     body: searchQuery,
//   });
// }

// 站点查询
export async function fetchSiteList(params) {
  return request(`${prefix}/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}
