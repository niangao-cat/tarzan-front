/*
 * @Description: COS报废复测投料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-19 17:19:40
 * @LastEditTime: 2021-03-17 11:27:23
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

// 查询剩余cos数量
export async function handleSearchSurplusCosNum(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/query-over-cos-num`, {
    method: 'GET',
    query: params,
  });
}

// 查询cos列表
export async function handleSearchCosTypeList(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/query-cos-type`, {
    method: 'GET',
    query: params,
  });
}

// 拆分
export async function cosScrapSplit(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-scrap-split`, {
    method: 'POST',
    body: params,
  });
}

// 来源条码扫描
export async function cosScrapScanMaterialLot(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-retest/cos-scrap-scan-material-lot`, {
    method: 'GET',
    query: params,
  });
}


/**
 * 条码打印
 * @param params
 * @returns {Promise<void>}
 */
export async function printingBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}
