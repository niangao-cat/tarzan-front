/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 工位产量明细查询
 */

import request from '@/utils/request';
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
  return request(`${prefix}/${organizationId}/hme-work-cell-details-report/list`, {
    method: 'GET',
    query,
  });
}
