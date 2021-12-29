/*
 * @Description: 配送需求平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-03 09:39:24
 * @LastEditTime: 2020-11-19 15:53:26
 */
import request from 'utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, getCurrentUserId } from 'utils/utils';

/**
 * 请求API前缀
 * @type {string}
 */
const prefixMCS = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();
const userId = getCurrentUserId();

// 获取列表数据 GET /v1/{organizationId}/
export async function queryList(params) {
  return request(`/mes/v1/${organizationId}/wms-distribution-demands`, {
    method: 'GET',
    query: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 发布
 * @async
 * @function fetchListData
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchRelease(params) {
  const url = `${prefixMCS}/${organizationId}/vmi-pos/publish`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}

/**
 * 同步需求/供应
 * @async
 * @function fetchListData
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function querySyncDemandAndSupply(params) {
  const url = `${prefixMCS}/${organizationId}/vmi-pos/demand/${userId}`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}

/**
 * 批量调整供应商
 * @async
 * @function batchAdjustSupplier
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function batchAdjustSupplier(params) {
  const url = `${prefixMCS}/${organizationId}/vmi-pos/adjust-save`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}

/**
 * 批量调整供应商
 * @async
 * @function batchAdjustSupplier
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function doPlanSuggest(params) {
  const url = `${prefixMCS}/${organizationId}/vmi-pos/confirm/${userId}`;
  return request(url, {
    method: 'POST',
    body: params,
  });
}

export async function createDeliveryNote(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demands/doc`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchDemandsDetail(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demand-detail`, {
    method: 'GET',
    query: params,
  });
}

export async function saveDemandsDetail(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demand-detail`, {
    method: 'POST',
    body: params,
  });
}

// 配送明细行删除
export async function handleDeleteRecord(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demand-detail`, {
    method: 'DELETE',
    body: params,
  });
}

export async function handleExport(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demands/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

/**
 * 校验生成配送单
 * @async
 * @function checkGenerateOrder
 * @param {Object} params - 请求参数 
 * @returns {Object} fetch Promise
 */ 
export async function checkGenerateOrder(params) {
  return request(`${prefixMCS}/${organizationId}/wms-distribution-demands/check`, {
    method: 'POST',
    body: params,
  });
}
