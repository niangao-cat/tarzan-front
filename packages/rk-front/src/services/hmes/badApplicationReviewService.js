/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-02 11:45:55
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-24520';
const organizationId = getCurrentOrganizationId();

// 主查询
export async function fetchBabApplocationList(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-check/list`, {
    method: 'GET',
    query: params,
  });
}

// 提交
// export async function submit(params) {
//   return request(`${Host}/v1/${organizationId}/hme-nc-check/submit`, {
//     method: 'POST',
//     body: params,
//   });
// }

// 批量提交
export async function submit(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-check/batch-check-submit`, {
    method: 'POST',
    body: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询下拉框数据(status)
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchStatueSelectList(params) {
  return request(`${Host}/v1/${organizationId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}