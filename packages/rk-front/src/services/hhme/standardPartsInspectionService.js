/*
 * @Description: 标准件检验
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-01 10:18:40
 * @LastEditTime: 2021-02-07 15:35:03
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';

const tenantId = getCurrentOrganizationId();

// 输入工位
export async function enterSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-ssn-inspect-result-headers/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 查询
export async function handleFetchList(params) {
  return request(`${Host}/v1/${tenantId}/hme-ssn-inspect-result-headers/query-ssn-inspect-tag`, {
    method: 'POST',
    body: params,
  });
}

// 报错结果
export async function handleSaveResult(params) {
  return request(`${Host}/v1/${tenantId}/hme-ssn-inspect-result-headers/save-ssn-inspect-result`, {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function handleSubmitResult(params) {
  return request(`${Host}/v1/${tenantId}/hme-ssn-inspect-result-headers/ssn-inspect-result-submit`, {
    method: 'POST',
    body: params,
  });
}