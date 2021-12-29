/*
 * @Description: 员工出勤报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-02 11:45:55
 */

import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

// 主查询
export async function fetchHeadList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-employee-export/findOne`, {
    method: 'GET',
    query: params,
  });
}

// 行查询
export async function fetchLineList(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-employee-export/findInfoList`, {
    method: 'GET',
    query: params,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: params,
  });
}

// 事业部查询
export async function fetchDivisionList(params) {
  return request(`${Host}/v1/${organizationId}/hme-equipment-monitor/department`, {
    method: 'GET',
    query: params,
  });
}

// 车间查询
export async function fetchWorkcellList(params) {
  return request(`${Host}/v1/${organizationId}/hme-equipment-monitor/workshop`, {
    method: 'GET',
    query: params,
  });
}

// 产量明细查询
export async function fetchMakeNumList(params) {
  const query = params;
  return request(`${Host}/v1/${organizationId}/hme-employee-export/job`, {
    method: 'POST',
    body: query,
  });
}

// 不良数明细查询
export async function fetchDefectsNumbList(params) {
  const query = params;
  return request(`${Host}/v1/${organizationId}/hme-employee-export/nc`, {
    method: 'POST',
    body: query,
  });
}

// 返修数量明细查询
export async function fetchRepairNumList(params) {
  const query = params;
  return request(`${Host}/v1/${organizationId}/hme-employee-export/job`, {
    method: 'POST',
    body: query,
  });
}

export async function fetchSummaryList(params) {
  const query = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/hme-employee-export/line-workcell-product-details`, {
    method: 'GET',
    query,
  });
}

export async function fetchNcList(params) {
  const query = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/hme-employee-export/line-workcell-nc-details`, {
    method: 'GET',
    query,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
