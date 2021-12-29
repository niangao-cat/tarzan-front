/**
 * 采购退货单查询
 *@date：2019/10/15
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-25444/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  采购退货单头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/purchase-return/query/instruction/doc`, {
    method: 'GET',
    query,
  });
}

/**
 *  采购退货单行列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/purchase-return/query/instruction`, {
    method: 'GET',
    query,
  });
}

/**
 *  采购退货单行明细
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/purchase-return/query/instruction/detail`, {
    method: 'GET',
    query,
  });
}

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${prefix}/${organizationId}/Material-get-return/get/site`, {
    method: 'GET',
  });
}
