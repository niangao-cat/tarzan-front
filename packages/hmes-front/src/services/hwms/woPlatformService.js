/**
 * 工单发料平台
 *@date：2019/10/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-22792/v1`;
// const prefix2 = `/mes-25444/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  生产订单查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders/produceOrderQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  生产订单需求查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders/produceOrderNeedQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  备料单查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDocHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders/demandOrderQuery`, {
    method: 'GET',
    query,
  });
}
/**
 *  备料单需求查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDocLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders/demandOrderNeedQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  备料单需求明细
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDocLineDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/work-orders/demandOrderDetailQuery`, {
    method: 'GET',
    query,
  });
}

/**
 * 生成备料单
 * @param params
 * @returns {Promise<void>}
 */
export async function generateData(params) {
  return request(`${prefix}/${organizationId}/work-orders/generateDemandMaterial`, {
    method: 'POST',
    body: params.produceOrderVOList,
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
