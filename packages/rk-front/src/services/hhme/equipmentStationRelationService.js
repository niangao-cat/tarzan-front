/*
 * @Description: 设备工位关系维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-09 15:50:10
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-19891/v1`;
const organizationId = getCurrentOrganizationId();

// 查询列表数据
export async function handleSearch(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-equipment-wkc-rel/list/ui`, {
    method: 'GET',
    query,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${prefix}/${organizationId}/hme-equipment-wkc-rel/update`, {
    method: 'POST',
    body: params.params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}