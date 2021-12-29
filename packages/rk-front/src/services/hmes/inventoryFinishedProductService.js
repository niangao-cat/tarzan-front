/*
 * @Description: 售后在制品盘点成品报表
 * @Version: 0.0.1
 * @Author: liyuan.liu@hand-china.com
 * @Date: 2021-03-31
 * @LastEditTime: 2021-03-31
 */

import request from '@/utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const prefix = `/mes`;

export async function handleFetchList(params) {
  return request(`/mes-report/v1/${organizationId}/hme-inventory-end-product/inventory-end-product-query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${prefix}/v1/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: params,
  });
}
