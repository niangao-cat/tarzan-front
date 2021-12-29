/*
 * @Description: 仓储物料进销存
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-19 10:27:00
 * @LastEditTime: 2020-11-21 18:33:28
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/wms-inv-onhand-qty-records/query`, {
    method: 'GET',
    query: params,
  });
}

export async function handleExport(params) {
  return request(`${Host}/v1/${organizationId}/wms-inv-onhand-qty-records/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

export async function fetchDetail(params) {
  const queryParams = parseParameters({
    page: params.page,
  });
  const param = params;
  delete param.page;
  return request(`${Host}/v1/${organizationId}/wms-inv-onhand-qty-records/inv-journal/ui`, {
    method: 'POST',
    query: queryParams,
    body: param,
  });
}