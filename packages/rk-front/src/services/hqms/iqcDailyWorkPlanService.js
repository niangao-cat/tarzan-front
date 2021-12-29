/*
 * @Description: IQC日常工作计划报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-28 14:26:02
 * @LastEditTime: 2020-12-28 16:57:54
 */

import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// table查询
export async function handleSearch(params) {
  return request(`${ReportHost}/v1/${organizationId}/iqc-inspection-kanban/kanban`, {
    method: 'POST',
    query: { page: params.page, size: params.size },
    body: params,
  });
}

// echart数据查询
export async function handleSearchChartsData(params) {
  return request(`${ReportHost}/v1/${organizationId}/iqc-inspection-kanban/kanban/list`, {
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


