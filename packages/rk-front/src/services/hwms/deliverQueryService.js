/**
 *送货单查询
 *@date：2019/9/22
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

/**
 * 请求API前缀
 * @type {string}
 */
const prefix = `${Host}/v1`; // `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  送货单查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function deliverRowList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-po-delivery/instruction/query`, {
    method: 'GET',
    query,
  });
}
/**
 * 查询送货单头
 * @async
 * @function deliverHeadList
 * @param {object} params - 查询条件
 */
export async function deliverHeadList(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-po-delivery/instruction/doc/query`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询明细
 * @async
 * @function deliverHeadList
 * @param {object} params - 查询条件
 */
export async function deliverDetailList(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-po-delivery/instruction/detail/query`, {
    method: 'GET',
    query: param,
  });
}

// 取消送货单
export async function cancelInstruction(params) {
  return request(`${prefix}/${organizationId}/wms-po-delivery/cancel/${params.instructionDocId}`, {
    method: 'GET',
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
    responseType: 'blob',
  });
}

// 头打印
export async function headPrint(params) {
  return request(`${Host}/v1/${organizationId}/wms-po-delivery/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

/**
 * 行明细数据查询
 * @async
 * @function fetchLineList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchLineDetailList(params) {
  return request(`${Host}/v1/${organizationId}/wms-po-delivery/detail/query/${params.instructionId}`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 获取默认工厂
 * @async
 * @function getSiteList
 * @param {Object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
