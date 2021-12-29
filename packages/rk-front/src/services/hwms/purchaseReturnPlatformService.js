/*
 *@description:采购退货平台Service
 *@author: ywj
 *@date: 2020-09-03 13:21:48
 *@version: V0.0.1
 */
import request from '@/utils/request';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 配送单查询头数据查询
 * @async
 * @function fetchHeadList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchHeadList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-purchase-return/list-head-ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 配送单查询行数据查询
 * @async
 * @function fetchLineList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-purchase-return/list-line-ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 配送单查询行明细数据查询
 * @async
 * @function fetchLineList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchLineDetailList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-purchase-return/list-details-ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * HZERO平台下拉查询
 * @async
 * @function fetchSelectOption
 * @returns {object} fetch Promise
 */
export async function fetchSelectOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

// 打印
export async function print(params) {
  return request(`${Host}/v1/${tenantId}/wms-purchase-return/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

/**
 * 查询下拉框数据(type)
 * @async
 * @function fetchTypeSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchTypeSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 查询下拉框数据(status)
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchStatueSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}


// 取消
export async function cancel(params) {
  return request(`${Host}/v1/${tenantId}/hme_distribution_list_query/cancel`, {
    method: 'POST',
    body: params,
  });
}

// 关闭
export async function close(params) {
  return request(`${Host}/v1/${tenantId}/hme_distribution_list_query/close`, {
    method: 'POST',
    body: params,
  });
}

