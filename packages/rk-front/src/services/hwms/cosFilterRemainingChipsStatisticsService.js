/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS筛选剩余芯片统计报表
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
  return request(`${prefix}/${organizationId}/hme-preparation-surplus-chip/list`, {
    method: 'GET',
    query,
  });
}

