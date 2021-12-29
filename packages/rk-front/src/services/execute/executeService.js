import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询执行作业管理数据
 * @async
 * @function fetchExecuteList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchExecuteList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 执行作业管理保存
 * @async
 * @function saveExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/save/ui`, {
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
 * 查询工艺路线数据
 * @async
 * @function getRoutingList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchRoutingList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/router-step-list/ui`, {
    method: 'GET',
    query: param,
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
  return request(`${Host}/v1/${tenantId}/mt-eo/detail/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询步骤实绩表格数据
 * @async
 * @function fetchStepList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchStepList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/router-step-actual-list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询不良实绩表格数据
 * @async
 * @function fetchPoorPerformanceList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchPoorPerformanceList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/nc-list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询数据收集组表格数据
 * @async
 * @function fetchDataCollectionList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchDataCollectionList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/tag-list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询有多少个数据收集组
 * @async
 * @function fetchTagGroupList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchTagGroupList(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/tag-group-list/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询执行作业表格数据
 * @async
 * @function fetchExecuteJobList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchExecuteJobList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/relation-list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询组件表格数据
 * @async
 * @function fetchModuleList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchModuleList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-calendar-shift/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询组件下面装配清单表格数据
 * @async
 * @function fetchBomList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchBomList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/bom-list/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 获取状态下拉框数据
 * @async
 * @function fetchExecuteStatusOptions
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchStatusOptions(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 执行作业拆分
 * @async
 * @function splitExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function splitExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/split/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业合并
 * @async
 * @function mergeExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function mergeExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/merge/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业保留
 * @async
 * @function holdExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function holdExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/hold/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业保留取消
 * @async
 * @function holdCancelExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function holdCancelExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/hold-cancel/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业下达
 * @async
 * @function releaseExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function releaseExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/release/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业完成
 * @async
 * @function completeExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function completeExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/complete/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业完成取消
 * @async
 * @function completeCancelExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function completeCancelExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/complete-cancel/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业关闭
 * @async
 * @function closeExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function closeExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/close/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业关闭取消
 * @async
 * @function closeCancelExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function closeCancelExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/close-cancel/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业废弃
 * @async
 * @function abandonExecute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function abandonExecute(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/abandon/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 执行作业状态变
 * @async
 * @function updateExecuteStatus
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function updateExecuteStatus(params) {
  return request(`${Host}/v1/${tenantId}/mt-eo/status/update/ui`, {
    method: 'POST',
    body: params,
  });
}
