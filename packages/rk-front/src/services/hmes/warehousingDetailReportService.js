/*
 * @Description: service
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:55:50
 * @LastEditTime: 2021-03-04 19:06:29
 */

import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

export async function handleFetchList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-stock-in-details/list`, {
    query: { page: params.page, size: params.size },
    method: 'POST',
    body: params,
  });
}
