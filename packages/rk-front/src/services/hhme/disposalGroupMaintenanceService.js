/*
 * @Description: 处置组功能维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com wenjie.yang01@hand-china.com
 * @Date: 2020-11-25 15:57:54
 * @LastEditTime: 2020-11-25 19:32:45
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-24623';
const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 获取主数据
export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/group-query`, {
    method: 'GET',
    query: newParams,
  });
}

// 获取明细数据
export async function fetchDetailList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/group-detail-query`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchFunctionTypeList(params) {
  return request(`${prefix}/v1/${tenantId}/hme-disposition/function-type-query`, {
    method: 'GET',
    query: params,
  });
}

// 保存数据
export async function handleSave(params) {
  return request(`${prefix}/v1/${tenantId}/hme-disposition/group-save-update`, {
    method: 'POST',
    body: params,
  });
}

// 删除明细信息
export async function deleteRelationRecord(params) {
  return request(`${prefix}/v1/${tenantId}/hme-disposition/group-member-del`, {
    method: 'DELETE',
    body: params,
  });
}

// 删除主信息
export async function deleteRecord(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/group-del`, {
    method: 'DELETE',
    query: newParams,
  });
}
