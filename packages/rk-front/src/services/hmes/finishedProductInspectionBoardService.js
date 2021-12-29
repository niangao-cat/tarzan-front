/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const ReportHost = '/mes-report-17306';
const organizationId = getCurrentOrganizationId() || 0;

// 查询检验情况看板
export async function queryInspectionCharts(params) {
  return request(`${ReportHost}/v1/${organizationId}/product-quality-inspection`, {
    method: 'GET',
    query: params,
  });
}

// 查询不良情况说明
export async function querybadConditionTable(params) {
  return request(`${ReportHost}/v1/${organizationId}/product-quality-inspection/nc-record`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchRefreshFrequency() {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-kanban-config`, {
    method: 'GET',
  });
}