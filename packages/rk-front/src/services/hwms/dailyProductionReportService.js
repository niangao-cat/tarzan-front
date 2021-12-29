/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 产量日明细报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

// const Host = '/mes-27947';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-pro-line-details/queryProductionLineDetails`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询报表明细数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDetailDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-pro-line-details/query-product-shift-list`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询报表明细数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDetailDataAllList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-pro-line-details/query-product-process-eo-list`, {
    method: 'GET',
    query,
  });
}
