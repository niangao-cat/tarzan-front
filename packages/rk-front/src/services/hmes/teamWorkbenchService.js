/*
 * @Description: 时效管理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-19 16:40:28
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-4279';
const organizationId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 工段下拉框
 */
export async function fetchLineList(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/line`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 班次下拉框
 */
export async function fetchShiftList(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/shift`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 根据工段 班次查询开班、结班时间
 * @param {Object} params 工段 班次
 */
export async function fetchSectionAndShift(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/query`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 开班
 */
export async function startClass(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/open/shift`, {
    method: 'POST',
    body: params,
  });
}

/**
 * @description: 结班
 */
export async function stopClass(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/end/shift`, {
    method: 'POST',
    body: params,
  });
}

// 查询当前工段未结班的班次
export async function fetchLineCloseShift(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/current/shift`, {
    method: 'GET',
    query: params,
  });
}

// 班组信息查询
export async function fetchShiftInfo(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/shift/data/query`, {
    method: 'GET',
    query: params,
  });
}

// 完工统计
export async function fetchCompletionStatistics(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/complete/statistical`, {
    method: 'GET',
    query: params,
  });
}

// 产品节拍
export async function fetchProductBeat(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/product/beat`, {
    method: 'GET',
    query: params,
  });
}

// 查询交接注意事项
export async function fetchHandoverMatter(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/handover/matter/query`, {
    method: 'GET',
    query: params,
  });
}

// 保存交接注注意事项
export async function saveHandoverMatter(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/handover/matter/submit`, {
    method: 'POST',
    body: params,
  });
}

// 工艺质量
export async function fetchOperationQuality(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/operation/quality`, {
    method: 'GET',
    query: params,
  });
}

// 其他异常查询
export async function fetchOtherException(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/other/exception`, {
    method: 'GET',
    query: params,
  });
}

// 设备管理
export async function fetchEquipmentManage(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/equipment/manage`, {
    method: 'GET',
    query: params,
  });
}

// 人员安全
export async function fetchEmployeeSecurity(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/employee/security`, {
    method: 'GET',
    query: params,
  });
}

// 保存交接注注意事项
export async function handleRollback(params) {
  return request(`${Host}/v1/${organizationId}/hme-open-end-shift/shift/end-cancel`, {
    method: 'POST',
    body: params,
  });
}