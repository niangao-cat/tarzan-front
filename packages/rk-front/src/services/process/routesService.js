import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 工艺路线列表查询
 * @async
 * @function fetchRouteList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchRouteList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-router/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 工艺路线列表新增
 * @async
 * @function saveRoutesList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveRoutesList(params) {
  return request(`${Host}/v1/${tenantId}/mt-router/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 工艺路线列表新增验证
 * @async
 * @function saveRoutesList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function confirmRoutesList(params) {
  return request(`${Host}/v1/${tenantId}/mt-router/confirm/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 工艺路线列表复制
 * @async
 * @function copyRoutesList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function copyRoutesList(params) {
  return request(`${Host}/v1/${tenantId}/mt-router/copy/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 工艺路线列表删除
 * @async
 * @function removeRoutesList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function removeRoutesList(params) {
  return request(`${Host}/v1/${tenantId}/mt-router/remove/ui`, {
    method: 'POST',
    body: params,
  });
}
// /**
//  * 工艺路线下拉查询
//  * @async
//  * @function fetchSelectOption
//  * @param {object} params - 查询条件
//  * @param {!number} [params.page = 0] - 数据页码
//  * @param {!number} [params.size = 10] - 分页大小
//  * @returns {object} fetch Promise
//  */
// export async function fetchSelectOption(params) {
//   return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
//     method: 'GET',
//     query: params,
//   });
// }

/**
 * 状态下拉查询
 * @async
 * @function fetchStatusOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchStatusOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 步骤类型
 * @async
 * @function fetchStepOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchStepOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
// /**
//  * 路径选中策略
//  * @async
//  * @function fetchStepDecisionOption
//  * @param {object} params - 查询条件
//  * @param {!number} [params.page = 0] - 数据页码
//  * @param {!number} [params.size = 10] - 分页大小
//  * @returns {object} fetch Promise
//  */
// export async function fetchStepDecisionOption(params) {
//   return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
//     method: 'GET',
//     query: params,
//   });
// }
/**
 * 查询扩展字段列表数据
 * @async
 * @function featchAttrList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function featchAttrList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/attr/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 库存组列表保存
 * @async
 * @function saveAttrList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttrList(params) {
  const param = parseParameters(params);
  return request(
    `${Host}/v1/${tenantId}/mt-mod-locator-group/attr/save/ui?locatorGroupId=${param.locatorGroupId}`,
    {
      method: 'POST',
      body: param.locatorGroupAttrs,
    }
  );
}

/**
 * 获取工艺路线明细信息
 * @async
 * @function fetchRoutesItemDetails
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchRoutesItemDetails(params) {
  return request(`${Host}/v1/${tenantId}/mt-router/detail/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取工艺路线明细步骤
 * @async
 * @function fetchRoutesItemStep
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchRoutesItemStep(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-router-step/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 获取工艺路线明细站点分配
 * @async
 * @function fetchRoutesItemSite
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchRoutesItemSite(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-router-site-assign/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 工艺路线列表新增
 * @async
 * @function saveTableAttrList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveTableAttrList(params) {
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取工艺详细信息
 * @async
 * @function fetchOperationDetails
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchOperationDetails(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation/detail/ui`, {
    method: 'GET',
    query: params,
  });
}
