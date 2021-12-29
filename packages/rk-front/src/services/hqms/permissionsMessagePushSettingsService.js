/*
 * @Description: permissionsMessagePushSettingsService
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-26 17:02:40
 * @LastEditTime: 2021-03-01 16:40:11
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 查询头数据
export async function handleHeadList(params) {
  return request(`/mes/v1/${organizationId}/hme-freeze-privileges`, {
    method: 'GET',
    query: params,
  });
}

// 查询仓库或者产线数据
export async function handleFetchWarehouseOrProLineList(params) {
  return request(`/mes/v1/${organizationId}/hme-freeze-privilege-details`, {
    method: 'GET',
    query: params,
  });
}

// 保存数据
export async function handleSave(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-privileges`, {
    method: 'POST',
    body: params,
  });
}

// 头明细查询
export async function handleHeadDetail(params) {
  return request(`/mes/v1/${organizationId}/hme-freeze-privileges/${params.privilegeId}`, {
    method: 'GET',
    query: params,
  });
}

// 删除
export async function handleDelete(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-privilege-details`, {
    method: 'DELETE',
    body: params,
  });
}
