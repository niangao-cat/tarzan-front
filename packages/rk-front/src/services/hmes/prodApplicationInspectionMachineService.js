/*
 * @Description: 应用检机报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-02 11:45:55
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-24520';
const organizationId = getCurrentOrganizationId();

// 主查询
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-data-record/mes-report/summary`, {
    method: 'GET',
    query: params,
  });
}


export async function handleExport(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-data-record/mes-report/summary-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

export async function handleFetchDetail(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-job-data-record/mes-report/detail`, {
    method: 'GET',
    query: params,
  });
}