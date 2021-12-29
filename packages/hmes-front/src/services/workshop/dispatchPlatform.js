/**
 * @date 2019-12-9
 * @author JRQ <ruiqi.jiang01@hand-china.com>
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 获取用户有权限的生产线
 * @async
 * @function fetchUsersProLineOptions
 * @returns {object} fetch Promise
 */
export async function fetchUsersProLineOptions() {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/user-prod-line/ui`, {
    method: 'GET',
  });
}

/**
 * 获取选中生产线下的工艺
 * @async
 * @function fetchUsersOperationOptions
 * @returns {object} fetch Promise
 */
export async function fetchUsersOperationOptions(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/operation/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取父表格数据
 * @async
 * @function fetchTableInfo
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchTableInfo(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/table-info/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 获取子表格数据
 * @async
 * @function fetchSubTableInfo
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSubTableInfo(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/sub-table-info/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 获取WKC范围
 * @async
 * @function fetchWKCRangeList
 * @returns {object} fetch Promise
 */
export async function fetchWKCRangeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/wkc-dispatch-range/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取WKC下图表信息
 * @async
 * @function fetchWKCChartsList
 * @returns {object} fetch Promise
 */
export async function fetchWKCChartsList(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/chart-info/one-day/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 调度平台(执行调度逻辑)
 * @async
 * @function confirmOperation
 * @returns {object} fetch Promise
 */
export async function confirmOperation(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/dispatch/confirm/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取一个图形的数据
 * @async
 * @function fetchOneChartInfo
 * @returns {object} fetch Promise
 */
export async function fetchOneChartInfo(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/chart-info/one-chart/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取选中图表的数据表格
 * @async
 * @function fetchScheduledSubTableList
 * @returns {object} fetch Promise
 */
export async function fetchScheduledSubTableList(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/scheduled-sub-table-info/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 表格排序
 * @async
 * @function scheduledSubTableListReorder
 * @returns {object} fetch Promise
 */
export async function scheduledSubTableListReorder(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/scheduled-sub-table/reorder/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 撤销
 * @async
 * @function revoke
 * @returns {object} fetch Promise
 */
export async function revoke(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/dispatch/revoke/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 撤销
 * @async
 * @function release
 * @returns {object} fetch Promise
 */
export async function release(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/dispatch/release/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取调度抽屉班次下拉列表
 * @async
 * @function fetchShiftCodeList
 * @returns {object} fetch Promise
 */
export async function fetchShiftCodeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/shift-code/combo-box/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 调度抽屉进行调度
 * @async
 * @function dispatchConfirm
 * @returns {object} fetch Promise
 */
export async function dispatchConfirm(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo-dispatch-platform/dispatch/confirm/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 物料类别保存
 * @async
 * @function saveMaterialCategory
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
// export async function saveMaterialCategory(params) {
//   return request(`${Host}/v1/${tenantId}/mt-material-category/save/ui`, {
//     method: 'POST',
//     body: params,
//   });
// }
