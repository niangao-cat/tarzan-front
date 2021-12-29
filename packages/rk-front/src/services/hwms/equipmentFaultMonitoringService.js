/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 设备故障监控
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
// GET /v1/{organizationId}/hme-equipment-fault-monitor
export async function queryDataList(params) {
  const param = parseParameters(params);
  return request(`/mes-report/v1/${organizationId}/hme-equipment-fault-monitor`, {
    method: 'GET',
    query: param,
  });
  // const page = params?params.page:{};
  // const pageQuery = parseParameters({ page });
  // return request(`${prefix}/${organizationId}/hme-equipment-fault-monitor/list`, {
  //   method: 'POST',
  //   query: pageQuery,
  //   body: params || {},
  // });
}
