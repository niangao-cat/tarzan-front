/*
 * @Description: 取片
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-08 10:03:12
 * @LastEditTime: 2020-11-11 08:59:14
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-8736';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchLineList(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-instructions/list-ui/${params.insHeadId}`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchHeadsDetail(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-ins-heads/detail`, {
    method: 'GET',
    query: params,
  });
}

// 保存头
export async function saveHeadData(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-ins-heads/save`, {
    method: 'POST',
    body: params,
  });
}

// 保存行
export async function saveLineData(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-instructions/save-ui`, {
    method: 'POST',
    body: params,
  });
}

// 删除行数据
export async function deleteLineData(params) {
  return request(`${Host}/v1/${tenantId}/hme-operation-instructions/save-ui`, {
    method: 'POST',
    body: params,
  });
}

// 获取文件列表
export async function fetchfileList(params) {
  const { urls } = params;
  return request(`/hfle/v1/${tenantId}/files?bucketName=${params.bucketName}`, {
    method: 'POST',
    body: urls,
  });
}