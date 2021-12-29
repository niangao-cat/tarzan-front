/**
 * @Description: 库存调拨
 * @author: ywj
 * @date 2020/3/25 10:47
 * @version 1.0
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId, getCurrentUserId, filterNullValueObject } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// const Host1 = '/mes-32410';
// const prefix = '/mes-29730'

// 查询库存头信息
export async function fetchHeaderList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/head`, {
    method: 'GET',
    query: param,
  });
}

// 查询行信息
export async function fetchLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/line`, {
    method: 'GET',
    query: param,
  });
}

// 查询更新行信息
export async function fetchLineUpdateList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/update/line`, {
    method: 'GET',
    query: param,
  });
}


// 查询行信息
export async function fetchDetailList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/material/lot`, {
    method: 'GET',
    query: param,
  });
}

// 工厂下拉框
export async function querySiteList() {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: {},
  });
}

// 仓库列表
export async function queryWarehouseList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/warehouse/get`, {
    method: 'GET',
    query: param,
  });
}
// 貨位列表
export async function queryLocatorList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/locator/get`, {
    method: 'GET',
    query: param,
  });
}

// 删除选中数据
export async function deleteSelectedList(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/delete/line`, {
    method: 'POST',
    body: params,
  });
}

/**
 * API保存
 * @async
 * @function saveAPI
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveData(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/create`, {
    method: 'POST',
    body: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 暂挂
export async function headStop(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/hold`, {
    method: 'POST',
    body: params.selectedHead,
  });
}

// 暂挂取消
export async function headStopCancel(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/hold/cancel`, {
    method: 'POST',
    body: params.selectedHead,
  });
}

// 审核
export async function headAudit(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/approval`, {
    method: 'POST',
    body: params.selectedHead,
  });
}

// 取消
export async function headCancel(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/cancel`, {
    method: 'POST',
    body: params.selectedHead,
  });
}

// 头打印
export async function headPrint(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/instruction/doc/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 库存现有量 查询
export async function showQuantity(params) {
  return request(`${Host}/v1/${tenantId}/cost-center-pick-return/locator/quantity/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function headClose(params) {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/close/button`, {
    method: 'PUT',
    body: filterNullValueObject(params),
  });
}

export async function fetchCurrentRoleMap() {
  const userId = getCurrentUserId();
  return request(`/iam/hzero/v1/${tenantId}/member-roles/user-roles/${userId}`, {
    method: 'GET',
  });
}