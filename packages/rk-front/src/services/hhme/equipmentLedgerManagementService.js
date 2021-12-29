/*
 * @Description: 设备台账管理
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-06-04 11:15:17
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

// const Host = '/mes-27947';
const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

// 获取台账列表
export async function fetchDeviceList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/v1/${tenantId}/hme-equipment/list/ui`, {
    method: 'GET',
    query,
  });
}

// 获取台账历史
export async function searchHistory(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/v1/${tenantId}/hme-equipment/query-equipment-his`, {
    method: 'GET',
    query,
  });
}

// 获取台账明细
export async function fetchDeviceDetail(params) {
  return request(`${prefix}/v1/${tenantId}/hme-equipment/query/one/ui`, {
    method: 'GET',
    query: params,
  });
}

// 保存数据
export async function handleSave(params) {
  return request(`${prefix}/v1/${tenantId}/hme-equipment/save/ui`, {
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

// 查询部门
export async function fetchDepartment(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}

// 工位变更历史
export async function stationChangeHistory(params) {
  return request(`${Host}/v1/${tenantId}/hme-equipment/query/workcellHis/ui`, {
    method: 'GET',
    query: params,
  });
}

// 打印校验
export async function printingCheck(params) {
  return request(`${Host}/v1/${tenantId}/hme-equipment/print-check`, {
    method: 'POST',
    body: params,
  });
}

// 打印
export async function printingBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-equipment/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 设备盘点 创建单据 POST /v1/{organizationId}/hme-equipment-stocktake-docs
export async function creatingDoc(params) {
  return request(`${prefix}/v1/${tenantId}/hme-equipment-stocktake-docs`, {
    method: 'POST',
    body: params,
  });
}

// 创建单据 获取台账列表
export async function fetchList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/v1/${tenantId}/hme-equipment/list`, {
    method: 'GET',
    query,
  });
}
