/*
 * @Description: 复测导入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-25 18:06:38
 * @LastEditTime: 2021-01-26 09:30:44
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-27947';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 查询头信息
export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-retest-import-header-list`, {
    method: 'GET',
    query: newParams,
  });
}

// 查询行信息
export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-retest-import-line-list`, {
    method: 'GET',
    query: newParams,
  });
}

// 打印
export async function printingBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}
