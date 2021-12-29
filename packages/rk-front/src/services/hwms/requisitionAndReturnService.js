/*
 * @Description: 领退料平台
 * @version: 0.0.1
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-29 14:14:54
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-24483/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/wms-warehouse-locator/get/site`, {
    method: 'GET',
  });
}

// 默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

/**
 *  领退料头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/cost-center-pick-return/list/head/ui`, {
    method: 'GET',
    query,
  });
}

/**
 *  领退料行列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/cost-center-pick-return/list/line/ui`, {
    method: 'GET',
    query,
  });
}

/**
 *  领退料行明细
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/cost-center-pick-return/list/details/ui/${params.instructionId}`, {
    method: 'GET',
    query,
  });
}

/**
 *  单据取消
 * @param params
 * @returns {Promise<void>}
 */
export async function closeInstruction(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/close/instruction/doc`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 保存领退料单头
 * @param params
 * @returns {Promise<void>}
 */
export async function saveHeadData(params) {
  return request(`${prefix}/${params.tenantId}/Material-get-return/save/instruction/doc`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 保存领退料单行
 * @param params
 * @returns {Promise<void>}
 */
export async function saveLineData(params) {
  return request(`${prefix}/${params.tenantId}/Material-get-return/save/instruction`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 保存领退料单-新
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(`${prefix}/${params.tenantId}/cost-center-pick-return/add`, {
    method: 'POST',
    body: { ...params },
  });
}

// 仓库下拉
export async function queryStorageList(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/storage/list`, {
    method: 'GET',
    query: params,
  });
}

// 货位下拉
export async function queryLocatorList(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/locator/list`, {
    method: 'GET',
    query: params,
  });
}

// 头行信息一起查询
export async function fetchHeadAndLineDetail(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/list/head-line/ui/${params.instructionDocId}`, {
    method: 'GET',
  });
}

// 删除行数据
export async function onDeleteLine(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/delete-line/${params.instructionId}`, {
    method: 'POST',
  });
}

// 条码打印
export async function printBarCode(params) {
  return request(`${prefix}/${organizationId}/cost-center-pick-return/print`, {
    method: 'POST',
    body: [params],
  });
}

// 送货单查询-创建条码
export async function deliverCreateBarcodeData(params) {
  return request(`${prefix}/${organizationId}/wms-po-delivery/create/barcode`, {
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
  return request(`${prefix}/${organizationId}/wms-material-log-print/pdf`, {
    method: 'POST',
    body: params,
  });
}

// 头打印
export async function headPrint(params) {
  return request(`${Host}/v1/${organizationId}/cost-center-pick-return/instruction/doc/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 库存现有量 查询
export async function showQuantity(params) {
  return request(`${Host}/v1/${organizationId}/cost-center-pick-return/locator/quantity/ui`, {
    method: 'POST',
    body: params,
  });
}

