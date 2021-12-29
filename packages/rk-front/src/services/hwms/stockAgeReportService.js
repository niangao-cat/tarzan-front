/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 19:12:08
 * @LastEditTime: 2020-11-18 22:06:43
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24503';

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 库龄查询
export async function fetchStockAgeData(params) {
  return request(`${Host}/v1/${organizationId}/wms-library-age-report/group/query`, {
    method: 'GET',
    query: params,
  });
}

// 报表查询
export async function fetchStackAgeReportData(params) {
  return request(`${Host}/v1/${organizationId}/wms-library-age-report/query`, {
    method: 'GET',
    query: params,
  });
}


