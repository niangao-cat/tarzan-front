/*
 * @Description: 交期试算
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-28 09:14:42
 * @LastEditTime: 2020-09-09 16:47:54
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-17823';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
// 获取wo
export async function fetchWo(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-trial-calculates/query-report`, {
    method: 'GET',
    query: params,
  });
}

// 更改开始结束时间
export async function changeDate(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-trial-calculates/save`, {
    method: 'POST',
    body: params,
  });
}
