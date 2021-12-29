/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-02 11:45:55
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-24520';
const organizationId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 站点中英文
export async function querySiteName(params) {
  return request(`${Host}/v1/${organizationId}/hme-report-setups/query-site-name`, {
    method: 'GET',
    query: params,
  });
}

// 查询行
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/hme-report-setups/query-report-setups-list`, {
    method: 'GET',
    query: params,
  });
}

// 保存或编辑数据
export async function handleSave(params) {
  return request(`${Host}/v1/${organizationId}/hme-report-setups/save-report-setups`, {
    method: 'POST',
    body: params,
  });
}

// 删除数据
export async function deleteData(params) {
  return request(`${Host}/v1/${organizationId}/hme-report-setups/delete-report-setups`, {
    method: 'DELETE',
    body: params,
  });
}
