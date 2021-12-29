/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:11:32
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-28621';
const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 获取头数据
export async function fetchHeadData(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/list/ui`, {
    method: 'GET',
    query: newParams,
  });
}

// 获取行数据
export async function fetchLineData(params) {
  const newParams = parseParameters(params);
  delete newParams.manageTagGroupId;
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/equipment-manage-tag/list/ui/${params.manageTagGroupId}`, {
    method: 'GET',
    query: newParams,
  });
}

// 保存头数据
export async function saveHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/update`, {
    method: 'POST',
    body: params,
  });
}

// 保存行数据
export async function saveLineData(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/equipment-manage-tag/update`, {
    method: 'POST',
    body: params.params,
  });
}

// 删除行数据
export async function deleteLineData(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/line/delete`, {
    method: 'POST',
    body: params,
  });
}

// 删除头数据
export async function deleteHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/head/delete`, {
    method: 'POST',
    body: params,
  });
}

// 获取数据类型
export async function getDataType(params) {
  return request(`${prefix}/v1/${tenantId}/mt-gen-type/limit-group/type`, {
    method: 'POST',
    body: params,
  });
}

// 获取数据类型
export async function getCollectionMethod(params) {
  return request(`${prefix}/v1/${tenantId}/mt-gen-type/limit-group/type`, {
    method: 'POST',
    body: params,
  });
}

// 增量同步
export async function partSync(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/part-sync/${params.manageTagGroupId}`, {
    method: 'POST',
    body: params,
  });
}

// 全量同步
export async function allSync(params) {
  return request(`${prefix}/v1/${tenantId}/equipment-manage-tag-group/all-sync/${params.manageTagGroupId}`, {
    method: 'POST',
  });
}
