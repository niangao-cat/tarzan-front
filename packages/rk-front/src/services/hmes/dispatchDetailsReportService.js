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

// 主查询
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/report-dispatch-details/query`, {
    method: 'POST',
    query: { page: params.page, size: params.size },
    body: params,
  });
}

export async function handleExport(params) {
  return request(`${Host}/v1/${organizationId}/report-dispatch-details/report-dispatch-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}