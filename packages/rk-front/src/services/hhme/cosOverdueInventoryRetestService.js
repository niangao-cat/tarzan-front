/*
 * @Description: cos过期库存复测投料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-19 09:38:37
 * @LastEditTime: 2021-01-20 10:37:21
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
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 校验条码
export async function handleCheckBarCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-scan-material-lot`, {
    method: 'GET',
    query: params,
  });
}

// 确认投料
export async function handleConfirmPut(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-retest-feed`, {
    method: 'POST',
    body: params,
  });
}