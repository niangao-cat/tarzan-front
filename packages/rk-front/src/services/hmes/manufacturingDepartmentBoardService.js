/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const ReportHost = '/mes-report-33139';
const organizationId = getCurrentOrganizationId() || 0;

// 查询检验情况看板
export async function fetchDailyPlanChart(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-day-plan-reach-rate`, {
    method: 'GET',
    query: params,
  });
}

// 查询不良情况说明
export async function fetchMonthPlanChart(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-month-plan`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchProductionGroupList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-through-rate-details`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchProcessNcList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-material-nc-top-five`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchDepartmentList() {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-kanban-area`, {
    method: 'GET',
  });
}

export async function fetchRefreshFrequency() {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-kanban-config`, {
    method: 'GET',
  });
}


// 达成率统计汇总 月度计划
export async function fetchRefreshrequencyget(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-month-plan?areaCode=${params.areaCode}`);
}
// 日计划达成率
export async function fetchRefreshFrequencymoon(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-day-plan-reach-rate?areaCode=${params.areaCode}`);
}
// export async function fetchRefreshFrequencymoon(params) {
//   const param = parseParameters(params);
//   return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-day-plan-reach-rate`, {
//     method: 'GET',
//     query: param,
//   });
// }
// 直通率

// export async function fetchRefreshFrequencypull(params) {
//   return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-area-through-rate-details?areaCode=${params.areaCode}`);
// }
// 工序不良TOP5

export async function fetchRefreshFrequencytop(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-make-center-produce-board/query-material-nc-top-five?areaCode=${params.areaCode}`);
}