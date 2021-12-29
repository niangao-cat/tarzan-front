/*
 * @Description: 工单管理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-09 17:23:35
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-24520';
// 工单列表查询
export async function handleGetTicketList(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-list`, {
    method: 'GET',
    query: params,
  });
}

// 修改备注及交期
export async function updateRemarkAndDeliveryDate(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/save`, {
    method: 'POST',
    body: params,
  });
}

// 工单下达
export async function buttonSend(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-release`, {
    method: 'POST',
    body: params.arry,
  });
}

// 工单暂停
export async function buttonStop(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-abandon`, {
    method: 'POST',
    body: params.arry,
  });
}

// 工单撤销
export async function buttonBack(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-close-cancel`, {
    method: 'POST',
    body: params.arry,
  });
}

// 工单关闭
export async function buttonClose(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-close`, {
    method: 'POST',
    body: params.arry,
  });
}

// 校验勾选的工单物料是否唯一
export async function checkTichet(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-prodLine/check`, {
    method: 'POST',
    body: params.workOrderIdList,
  });
}

// 查询产线
export async function fetchLine(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-prodLine`, {
    method: 'GET',
    query: params,
  });
}

// 分配产线
export async function saveProdLine(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-prodLine/confirm`, {
    method: 'POST',
    body: params,
  });
}

// 查询事业部
export async function fetchDepartment(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}

// 工单下达
export async function ticketRelease(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order/status/update/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchComponentMeaterial(params) {
  return request(`${Host}/v1/${tenantId}/wms-component-demand-records/requirement`, {
    method: 'GET',
    query: params,
  });
}
