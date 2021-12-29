/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-27 10:25:46
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24503';

// cos在制报表查询
export async function fetchCosProduction(params) {
  return request(`${ReportHost}/v1/${organizationId}/cos-in-production`, {
    method: 'GET',
    query: params,
  });
}

export async function handleExport(params) {
  return request(`${ReportHost}/v1/${organizationId}/cos-in-production/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

// 获取不良信息
export async function getNcFlagData(params) {
  return request(`${ReportHost}/v1/${organizationId}/cos-in-production/nc-record-list`, {
    method: 'GET',
    query: params,
  });
}


