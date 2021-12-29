/*
 * @Description: 非标产品报表
 * @Version: 0.0.1
 * @Autor: xinyu.wang02@hand-china.com
 * @Date: 2020-12-14 11:45:55
 */

import request from '@/utils/request';
import { ReportHost, Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 主查询
export async function fetchHeadList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-common-report/non-standard-product-report`, {
    method: 'GET',
    query: params,
  });
}

// 行查询
export async function fetchLineList(params) {
  return request(`${Host}/v1/${organizationId}/hme-employee-export/findInfoList`, {
    method: 'GET',
    query: params,
  });
}

// 待上线查询
export async function fetchmakeNumList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-common-report/wait-qty-details-query`, {
    method: 'GET',
    query: params,
  });
}

// 在线数量明细查询
export async function fetchdefectsNumbList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-common-report/online-qty-details-query`, {
    method: 'GET',
    query: params,
  });
}

// 完工（末道）明细查询
export async function fetchrepairNumList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-common-report/completed-qty-details-query`, {
    method: 'GET',
    query: params,
  });
}


