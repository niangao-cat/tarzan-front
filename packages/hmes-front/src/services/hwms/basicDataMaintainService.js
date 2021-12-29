/**
 * 基础数据维护
 *@date：2019/10/21
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
 *  查询备料提前期
 * @param params
 * @returns {Promise<void>}
 */
export async function queryPreparingTime() {
  return request(`${prefix}/${organizationId}/distribution-maintenance/get/preparing/lead/time`, {
    method: 'GET',
  });
}

/**
 *  查询备料时间列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryPreparingList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/distribution-maintenance/query/preparing/time`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询送料时间列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDeliveryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/distribution-maintenance/query/delivery/time`, {
    method: 'GET',
    query,
  });
}

/**
 * 保存备料时间数据
 * @param params
 * @returns {Promise<void>}
 */
export async function savePreparingData(params) {
  return request(`${prefix}/${params.tenantId}/distribution-maintenance/save/preparing/time`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 * 保存送料时间数据
 * @param params
 * @returns {Promise<void>}
 */
export async function saveDeliveryData(params) {
  return request(`${prefix}/${params.tenantId}/distribution-maintenance/save/delivery/time`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 *  查询组件配送策略列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryStrategyList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(
    `${prefix}/${organizationId}/distribution-maintenance/query/distribution/strategy`,
    {
      method: 'GET',
      query,
    }
  );
}

/**
 * 保存组件配送策略数据
 * @param params
 * @returns {Promise<void>}
 */
export async function saveStrategyData(params) {
  return request(
    `${prefix}/${params.tenantId}/distribution-maintenance/save/distribution/strategy`,
    {
      method: 'POST',
      body: { ...params },
    }
  );
}

/**
 * 保存合并规则数据
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(
    `${prefix}/${params.tenantId}/distribution-maintenance/save/distribution/strategy/prod/line`,
    {
      method: 'POST',
      body: { ...params },
    }
  );
}

/**
 *  查询合并规则
 * @param params
 * @returns {Promise<void>}
 */
export async function queryProdLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(
    `${prefix}/${organizationId}/distribution-maintenance/query/distribution/strategy/prod/line`,
    {
      method: 'GET',
      query,
    }
  );
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
