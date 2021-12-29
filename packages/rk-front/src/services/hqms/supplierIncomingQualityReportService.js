/*
 * @Description: 供应商来料在线质量
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-28 16:12:25
 * @LastEditTime: 2020-12-29 14:31:38
 */

import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// table查询
export async function handleSearch(params) {
  return request(`${ReportHost}/v1/${organizationId}/iqc-inspection-kanban/quality`, {
    method: 'POST',
    query: { page: params.page, size: params.size },
    body: params,
  });
}

// echart数据查询
export async function handleSearchChartsData(params) {
  return request(`${ReportHost}/v1/${organizationId}/iqc-inspection-kanban/quality/chart`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 默认站点
 *
 * @export
 * @returns
 */
export function fetchDefaultSite () {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 导出
export async function exportExcel(params) {
  return request(`${ReportHost}/v1/${organizationId}/iqc-inspection-kanban/quality-export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

