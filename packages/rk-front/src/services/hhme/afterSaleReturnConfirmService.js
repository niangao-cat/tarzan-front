/*
 * @Description: 售后返品
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-08 20:49:32
 * @LastEditTime: 2020-09-09 10:10:57
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

// 扫描sn
export async function scaneMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-data-records/scan-repair-code`, {
    method: 'POST',
    body: params,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-data-records/save-record`, {
    method: 'POST',
    body: params,
  });
}

// 完成
export async function finishData(params) {
  return request(`${Host}/v1/${tenantId}/hme-service-data-records/complete-record`, {
    method: 'POST',
    body: params,
  });
}



