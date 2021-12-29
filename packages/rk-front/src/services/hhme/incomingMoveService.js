/*
 * @Description: 来料录入
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-13 19:26:35
 * @LastEditTime: 2020-12-30 14:04:42
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-20491';

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

// 扫描来源条码
export async function scanSourceLotCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-operation-transfer/scan-source-barcode`, {
    method: 'GET',
    query: params,
  });
}

// 更改ContainerType
export async function changeContainerTypeCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-job-sn/cosnum`, {
    method: 'GET',
    query: params,
  });
}

// 拆分
export async function materiallotSplit(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-operation-transfer/material-lot-split`, {
    method: 'POST',
    body: params,
  });
}