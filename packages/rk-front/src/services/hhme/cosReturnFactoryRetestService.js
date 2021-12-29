/*
 * @Description: 返场复测
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-21 15:38:54
 * @LastEditTime: 2021-01-26 17:47:14
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}


// 输入工位
export async function enterSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 获取剩余芯片数
export async function fetchRemainingQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/remaining/qty`, {
    method: 'GET',
    query: params,
  });
}

// 更改costype
export async function changeCosType(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/cosnum`, {
    method: 'GET',
    query: params,
  });
}

// 扫描来源条码
export async function handleSourceLotCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-back-factory-scan-material-lot`, {
    method: 'GET',
    query: params,
  });
}

// 拆分
export async function cosBackFactorySplit(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-back-factory-split`, {
    method: 'POST',
    body: params,
  });
}