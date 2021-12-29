/*
 * @Description: 材料不良明细报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-02 17:42:49
 * @LastEditTime: 2021-02-03 10:04:16
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

export async function handleFetchList(params) {
  const newParams = parseParameters(params);
  return request(`/mes-report/v1/${tenantId}/hme-material-bad-detailed`, {
    method: 'GET',
    query: newParams,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`/mes/v1/${tenantId}/site`, {
    method: 'GET',
    query: params,
  });
}
