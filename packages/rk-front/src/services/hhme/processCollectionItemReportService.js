/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-13 16:52:15
 * @LastEditTime: 2020-08-03 18:34:52
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-27947';

// 查询报表数据GET /v1/{organizationId}/hme-process-collect
export async function fetchDataList(params) {
  const { page, size } = params;
  return request(`/mes-report/v1/${tenantId}/hme-process-collect`, {
    method: 'POST',
    body: params,
    query: { page, size },
  });
}

// 导出 GET /v1/{organizationId}/hme-process-collect/export
export async function exportExcel(params) {
  return request(`/mes-report/v1/${tenantId}/hme-process-collect/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

export async function fetchUserDefaultSite(params) {
  return request(`${Host}/v1/${tenantId}/qms-transition-rules/user/default/site/ui`, {
    method: 'GET',
    query: params,
  });
}

// 明细
export async function fetchDetailList(params) {
  const { jobId, ...newParams } = params;
  return request(`/mes-report/v1/${tenantId}/hme-process-collect/detail/${jobId}`, {
    method: 'GET',
    query: newParams,
  });
}

/**
 * 获取状态下拉框数据
 * @async
 * @function fetchExecuteStatusOptions
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchStatusOptions(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${tenantId}/site`, {
    method: 'GET',
    query: params,
  });
}
