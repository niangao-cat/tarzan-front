/*
 * @Description: service
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-03-09 17:28:58
 * @LastEditTime: 2021-03-09 18:11:52
 */


import request from '@/utils/request';
import { ReportHost, Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

export async function handleSearch(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-monthly-plan`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchAreaList(params) {
  return request(`${Host}/v1/${organizationId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}
