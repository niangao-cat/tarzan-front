/*
 * @Description: 生产数据采集
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 20:28:31
 * @LastEditTime: 2020-07-21 22:29:10
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-27947';

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 输入工位
export async function enterSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/workcell-code-scan`, {
    method: 'GET',
    query: params,
  });
}

// 扫描序列号
export async function scanningMaterialLotCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/data-collect-line-list`, {
    method: 'GET',
    query: params,
  });
}

// 头数据更新
export async function updateHeadInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/update-data-collect-header-info`, {
    method: 'POST',
    body: params.arry,
  });
}

// 行数据更新
export async function updateDataCollectLineInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/update-data-collect-line-info`, {
    method: 'POST',
    body: params,
  });
}

// 校验当前无聊是否为sn物料
export async function querySnMaterialQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/sn-material-qty`, {
    method: 'GET',
    query: params,
  });
}

// 完成
export async function handleFinish(params) {
  return request(`${Host}/v1/${tenantId}/hme-data-collect-headers/update-data-collect-header-info`, {
    method: 'POST',
    body: params,
  });
}