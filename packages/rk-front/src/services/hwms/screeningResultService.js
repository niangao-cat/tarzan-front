/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 导出结果
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  导出结果
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = parseParameters(params);
  return request(`${prefix}/${organizationId}/hme-selection-detailss/query-selection-details`, {
    method: 'GET',
    query,
  });
}
