/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： COS员工产量汇总报表
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
  return request(`${prefix}/${organizationId}/hme-cos-staff-product/staff-product-query`, {
    method: 'GET',
    query,
  });
}

