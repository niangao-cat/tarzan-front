/**
 *销售退货单查询
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
const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/wms-soDelivery-platform/siteDropDownBoxQuery`, {
    method: 'GET',
  });
}
/**
 * 销售退货单头查询
 * @param params
 * @returns {Promise<void>}
 */
export async function salesReturnDocHeadList(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-sales-Return-Doc/salesReturnDocHead`, {
    method: 'GET',
    query: param,
  });
}
/**
 *  销售退货单行查询
 * @param params
 * @returns {Promise<void>}
 */
export async function salesReturnDocRowList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-sales-Return-Doc/salesReturnDocLine`, {
    method: 'GET',
    query,
  });
}

/**
 * 查询明细
 * @async
 * @function deliverHeadList
 * @param {object} params - 查询条件
 */
export async function salesReturnDocDetailList(params) {
  const param = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-sales-Return-Doc/salesReturnDocDetail`, {
    method: 'GET',
    query: param,
  });
}
