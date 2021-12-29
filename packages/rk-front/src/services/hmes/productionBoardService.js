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

// 产量可视化
export async function queryProLine(params) {
  return request(`${Host}/v1/${organizationId}/hme-report-setups/prod-vision-monitor-system-query`, {
    method: 'GET',
    query: params,
  });
}

 // GET /v1/{organizationId}/
 export async function fetchFileUrl(params) {
  return request(`/hfle/v1/${organizationId}/files/${params.attachmentUUID}/file`, {
    method: 'GET',
    query: params,
  });
}