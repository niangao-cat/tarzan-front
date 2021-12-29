/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS完工芯片明细表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';

const prefix = `${ReportHost}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  const { size, page, ...body } = query;
  return request(`${prefix}/${organizationId}/cos-completion-detail`, {
    method: 'POST',
    query: { size, page },
    body,
  });
}

/**
 *  导出GET /v1/{organizationId}/cos-completion-detail/export
 * @param params
 * @returns {Promise<void>}
 */
// export async function handleExport(params) {
//   return request(`${ReportHost}/v1/${organizationId}/cos-completion-detail/export`, {
//     method: 'GET',
//     query: params,
//     responseType: 'blob',
//   });
// }

