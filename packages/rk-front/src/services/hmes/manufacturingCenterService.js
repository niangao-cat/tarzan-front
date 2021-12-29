/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const ReportHost = '/mes-report-17306';
const organizationId = getCurrentOrganizationId() || 0;

// 查询检验情况看板
export async function fetchDailyPlanChart(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-day-plan-reach-rate`, {
    method: 'GET',
    query: params,
  });
}

// 查询不良情况说明
export async function fetchMonthPlanChart(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-month-plan`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchProductionGroupList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-through-rate-details`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchProcessNcList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-process-nc-top-five`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchInspectionNcList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-inspection-nc`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchRefreshFrequency() {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-kanban-config`, {
    method: 'GET',
  });
}

export async function fetchProdLineList(query) {
  const queryParams = parseParameters(query);
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-kanban-prod-line`, {
    method: 'GET',
    query: queryParams,
  });
}