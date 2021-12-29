/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:11:32
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-7095';
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
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-heads/tag-formula/get-head-list`, {
    method: 'GET',
    query: params,
  });
}


// 保存头数据
export async function saveHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-heads/tag-formula/insert-head-list`, {
    method: 'POST',
    body: params,
  });
}

// 修改头数据
export async function updateHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-heads/tag-formula/update-head-list`, {
    method: 'POST',
    body: params,
  });
}

// 删除头数据
export async function deleteHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-heads/tag-formula/delete-head-list/${params.tagFormulaHeadId}`, {
    method: 'POST',
    body: params,
  });
}


// 获取行数据
export async function fetchLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-lines/tag-formula-line/get-line-list`, {
    method: 'GET',
    query: params,
  });
}


// 保存行数据
export async function saveLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-lines/tag-formula-line/save-line`, {
    method: 'POST',
    body: params.params,
  });
}

// 修改行数据
export async function updateLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-lines/tag-formula-line/save-line-update`, {
    method: 'POST',
    body: params.params,
  });
}

// 删除行数据
export async function deleteLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-formula-lines/tag-formula-line/delete-line-list/${params.tagFormulaLineId}`, {
    method: 'DELETE',
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
