/*
 * @Description: 加严放宽
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-22 09:01:34
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-25 10:53:44
 * @Copyright: Copyright (c) 2019 Hand
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24503';

// 查询
export async function fetchList(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-transition-rules/query`, {
    method: 'GET',
    query: param,
  });
}

// 保存
export async function saveData(params) {
  // console.log(JSON.stringify(params));
  return request(`${Host}/v1/${organizationId}/qms-transition-rules/createOrUpdate`, {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteData(params) {
  // console.log(JSON.stringify(params));
  return request(`${Host}/v1/${organizationId}/qms-transition-rules/delete`, {
    method: 'DELETE',
    body: params,
  });
}

// 默认当前用户站点
export async function getDefaultSite() {
  return request(`${Host}/v1/${organizationId}/qms-transition-rules/user/default/site/ui`, {
    method: 'GET',
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
