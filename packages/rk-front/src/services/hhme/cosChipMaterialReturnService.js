/*
 * @Description: cos芯片退料
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-11 10:40:17
 * @LastEditTime: 2020-12-14 15:42:43
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


/**
 * @description: 输入工位
 * @param {*} params 工位编码
 * @return {object} fetch Promise
 */
export async function enterSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

/**
 * @description: 查询工单
 * @param {*} params 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchWorkOrder(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-material-return/cos/scan-work-order?workOrderId=${params.workOrderId}`, {
    method: 'POST',
    // body: params,
  });
}

/**
 * @description: 扫描退料条码
 * @param {*} params 查询条件
 * @returns {object} fetch Promise
 */
export async function scaneReturnBarCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-material-return/cos/scan-material-lot`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 扫描目标条码
 * @param {*} params 查询条件
 * @returns {object} fetch Promise
 */
export async function scaneTargetBarCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-material-return/cos/scan-material-lot`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 确认
 * @param {*} params 查询条件
 * @returns {object} fetch Promise
 */
export async function handleReturnConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-material-return/cos/material-return`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 条码打印
 * @param params
 * @returns {Promise<void>}
 */
export async function printingBarcode(params) {
  return request(`${Host}/v1/${tenantId}/wms-material-log-print/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}