/*
 * @Description: IQC检验看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 18:15:25
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-08 11:37:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId() || 0;
// const ReportHost = '/mes-report-16031';

// 看板卡片数据
export async function fetchBoarCard(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/iqc/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 30天检验物料量
export async function fetchMaterial(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/day/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 趋势图数据查询
export async function fetchTrend(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/month/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 到货仓库数据查询
export async function fetchLocator(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/wait/examine/task`, {
    method: 'GET',
    query: params,
  });
}

// 不良检验数据查询
export async function fetchbadInspect(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/inspector/date/ui`, {
    method: 'GET',
    query: params,
  });
}

// 日检验数据查询
export async function fetchDayInspect(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-boards/day/check/ng/data`, {
    method: 'GET',
    query: params,
  });
}

