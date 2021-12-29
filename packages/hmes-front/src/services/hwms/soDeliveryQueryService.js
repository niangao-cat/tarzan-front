/**
 * 出货单查询
 *@date：2019/10/11
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-24518/v1`;
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
 *  出货单头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-soDelivery-platform/soDeliveryQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  出货单行列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-soDelivery-platform/soDeliveryLineQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  出货单行明细
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-soDelivery-platform/soDeliveryLineDetailQuery`, {
    method: 'GET',
    query,
  });
}
