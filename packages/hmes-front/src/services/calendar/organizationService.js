import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询组织所属日历
 * @async
 * @function fetchCalendarOrgList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchCalendarOrgList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/list/ui`, {
    method: 'GET',
    query: param,
  });
}
