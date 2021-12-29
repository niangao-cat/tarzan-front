import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

// const Host = '/mes-24520';

const tenantId = getCurrentOrganizationId();

/**
 * 工艺维护列表查询
 * @async
 * @function fetchOperationList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchOperationList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-operation/list/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 工艺维护站点下拉查询
 * @async
 * @function fetchSiteOption
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSiteOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-site/limit-user/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 状态获取
export async function fetchStatusOption(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 工艺维护列表单条数据详情查询
 * @async
 * @function fetchSingleOperation
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSingleOperation(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation/detail/ui`, {
    method: 'GET',
    query: params,
  });
}
/**
 * 工艺维护列表新增
 * @async
 * @function saveOperationList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveOperationList(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 子步骤列表查询
 * @async
 * @function fetchChilStepsList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchChilStepsList(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-substep/list/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 子步骤列表删除
 * @async
 * @function deleteChildStepsList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteChildStepsList(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-substep/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

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
    `${Host}/v1/${tenantId}/mt-mod-locator-group/attr/save/ui?locatorGroupId=${
      param.locatorGroupId
    }`,
    {
      method: 'POST',
      body: param.locatorGroupAttrs,
    }
  );
}

// 查询已保存的资质数据
export async function fetchQualityList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-assigns`, {
    method: 'GET',
    query: param,
  });
}

// 点击添加资质查询可添加的资质数据
export async function fetchQuality(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-assigns/list/lov/ui`, {
    method: 'GET',
    query: param,
  });
}

// 保存资质数据
export async function saveQuality(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-assigns`, {
    method: 'POST',
    body: params.arr,
  });
}

// 删除资质数据
export async function delQuality(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-assigns`, {
    method: 'DELETE',
    body: params.arr,
  });
}

export function fetchEquipmentList(params) {
  const { operationId, ...newParams } = params;
  const param = parseParameters(newParams);
  return request(`${Host}/v1/${tenantId}/hme-op-eq-rels/${operationId}`, {
    method: 'GET',
    query: param,
  });
}

export function fetchDataItemList(params) {
  const { operationId, ...newParams } = params;
  const param = parseParameters(newParams);
  return request(`${Host}/v1/${tenantId}/hme-op-tag-rels/${operationId}`, {
    method: 'GET',
    query: param,
  });
}

export function saveEquipmentList(params) {
  return request(`${Host}/v1/${tenantId}/hme-op-eq-rels/createOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

export function deleteEquipmentList(params) {
  return request(`${Host}/v1/${tenantId}/hme-op-eq-rels`, {
    method: 'DELETE',
    body: params,
  });
}

export function saveDataItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-op-tag-rels/save-op-tag-rel`, {
    method: 'POST',
    body: params,
  });
}

export function deleteDataItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-op-tag-rels/remove-rel`, {
    method: 'DELETE',
    body: params,
  });
}
