import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询日历表格数据
 * @async
 * @function fetchWorkingList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchWorkingList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-calendar/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 日历保存
 * @async
 * @function saveWorking
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveWorking(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar/save/ui`, {
    method: 'POST',
    body: params,
  });
}

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
 * 查询详细数据
 * @async
 * @function fetchDetailList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchDetailList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar/id/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchShiftTypeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-shift/types/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询单行详细数据
 * @async
 * @function fetchWorkingLineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchShiftList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/grid/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询某一日期下的所有排班信息
 * @async
 * @function fetchCalendarShiftList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchCalendarShiftList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询某一日期下的所有排班信息,没有分页
 * @async
 * @function fetchCalendarShiftNoPageList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchCalendarShiftNoPageList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/no-page/list/ui`, {
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
/**
 * 查询组织树
 * @async
 * @function fetchTreeList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchTreeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/tree/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 日历初始化
 * @async
 * @function initCalendar
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function initCalendar(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 复制班次
 * @async
 * @function copyShift
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function copyShift(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 复制班次前校验
 * @async
 * @function copyShiftCheck
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function copyShiftCheck(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/check/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除日历班次信息
 * @async
 * @function deleteShift
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteShift(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 保存日历班次信息
 * @async
 * @function saveShift
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveShift(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取站点表格数据
 * @async
 * @function fetchSiteList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/list/ui`, {
    method: 'GET',
    query: { ...params, organizationType: 'SITE', enableFlag: 'Y' },
  });
}

/**
 * 保存站点
 * @async
 * @function saveSite
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除站点
 * @async
 * @function deleteSite
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取区域表格数据
 * @async
 * @function fetchAreaList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchAreaList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/list/ui`, {
    method: 'GET',
    query: { ...params, organizationType: 'AREA', enableFlag: 'Y' },
  });
}

/**
 * 保存区域
 * @async
 * @function saveArea
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveArea(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除区域
 * @async
 * @function deleteArea
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteArea(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取生产线表格数据
 * @async
 * @function fetchProlineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchProlineList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/list/ui`, {
    method: 'GET',
    query: { ...params, organizationType: 'PROD_LINE', enableFlag: 'Y' },
  });
}

/**
 * 保存生产线
 * @async
 * @function saveProline
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveProline(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除生产线
 * @async
 * @function deleteProline
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteProline(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取工作单元表格数据
 * @async
 * @function fetchWorkcellList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchWorkcellList(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/list/ui`, {
    method: 'GET',
    query: { ...params, organizationType: 'WORKCELL', enableFlag: 'Y' },
  });
}

/**
 * 保存工作单元
 * @async
 * @function saveWorkcell
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveWorkcell(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除工作单元
 * @async
 * @function deleteWorkcell
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteWorkcell(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/init/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 保存组织关系
 * @async
 * @function saveOrgRel
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveOrgRel(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/save/batch/ui`, {
    method: 'POST',
    body: { ...params, enableFlag: 'Y' },
  });
}

/**
 * 删除组织关系
 * @async
 * @function deleteOrgRel
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteOrgRel(params) {
  return request(`${Host}/v1/${tenantId}/mt-calendar-org-rel/remove/ui`, {
    method: 'POST',
    body: params.calendarOrgRelIdList,
  });
}
