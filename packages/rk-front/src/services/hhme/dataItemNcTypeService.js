/*
 * @Description: 设备点检&保养项目维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-10 11:11:32
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

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

// 获取数据
export async function fetchData(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-tag-ncs/hme-tag-nc/get-tag-nc-list`, {
    method: 'GET',
    query: newParams,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-ncs/hme-tag-nc/create`, {
    method: 'POST',
    body: params.params,
  });
}

// 修改数据
export async function updateData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-ncs/hme-tag-nc/update`, {
    method: 'POST',
    body: params.params,
  });
}

// 删除数据
export async function deleteData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-tag-ncs/hme-tag-nc/delete/${params.tagNcId}`, {
    method: 'DELETE',
    body: params,
  });
}


