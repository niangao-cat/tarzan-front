/*
 * @Description: 处置方法维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com wenjie.yang01@hand-china.com
 * @Date: 2020-11-25 19:34:24
 * @LastEditTime: 2020-11-25 22:13:15
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-24623';
const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 获取处置方法类型
export async function fetchFunctionType(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/function-type-query`, {
    method: 'GET',
    query: newParams,
  });
}

// 获取主数据
export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/function-query`, {
    method: 'GET',
    query: newParams,
  });
}

// 保存数据
export async function saveRecord(params) {
  return request(`${prefix}/v1/${tenantId}/hme-disposition/function-save`, {
    method: 'POST',
    body: params,
  });
}

// 删除数据
export async function deleteRecord(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-disposition/function-del`, {
    method: 'DELETE',
    query: newParams,
  });
}
