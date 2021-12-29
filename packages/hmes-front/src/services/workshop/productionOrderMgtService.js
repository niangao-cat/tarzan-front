/**
 * @date 2019-12-18
 * @author 许碧婷 <biting.xu@hand-china.com>
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
/**
 * 查询生产指令管理列表
 * @async
 * @function fetchProductionList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.page = 0] - 数据页码
 * @returns {object} fetch promise
 */
export async function fetchProductionList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 生产指令关系列表
export async function fetchProductionRelList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/wo/rel/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchProductionDetail(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/detail/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchEoList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/eo/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 拆分
export async function postProductionStatus(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/status/update/ui`, {
    method: 'POST',
    body: params,
  });
}

// eo 创建保存
export async function saveEoCreateForm(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/eo/create/ui`, {
    method: 'POST',
    body: params,
  });
}

// wo 拆分
export async function saveWoSplitForm(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/wo/split/ui`, {
    method: 'POST',
    body: params,
  });
}

// wo 整体保存
export async function saveProductionDetailForm(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// wo合并保存
export async function saveWoMergeForm(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/wo/merge/ui`, {
    method: 'POST',
    body: params,
  });
}

// wo bom split
export async function fetchBomSplit(params = {}) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/bom/split/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchEoCreateDetail(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/wo/qty/ui`, {
    method: 'GET',
    query: param,
  });
}

// process route
export async function fetchProcessRouteList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/router/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 子步骤
export async function fetchSubStepList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/sub-router-step/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 装配清单
export async function fetchAssemblyList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/bom/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// fetchChildrenAssembly
export async function fetchChildrenAssemblyList(params = {}) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-work-order/bom/substitute/list/ui`, {
    method: 'GET',
    query: param,
  });
}
