/*
 * @Description: 工序在制查询
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-24 11:52:35
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-18 15:30:27
 * @Copyright: Copyright (c) 2019 Hand
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-4279';

// 工序在制查询
export async function fetchProcessInProcess(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-working`, {
    method: 'GET',
    query: params,
  });
}

// 获取生产线
export async function fetchProductionLine(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-working/production-line`, {
    method: 'GET',
    query: params,
  });
}

// 获取车间
export async function fetchWorkShop(params) {
  return request(`${Host}/v1/${organizationId}/hme-eo-working/workshop`, {
    method: 'GET',
    query: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
