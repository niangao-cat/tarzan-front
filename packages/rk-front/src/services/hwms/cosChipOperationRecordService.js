/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS芯片作业记录
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
  return request(`/mes-report/v1/${organizationId}/hme-load-jobs`, {
    method: 'GET',
    query,
  });
}
