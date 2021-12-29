/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS报废撤回
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-cos-scrap-back/cos-scrap-query`, {
    method: 'GET',
    query,
  });
}

/**
 *  数据校验
 * @param params
 * @returns {Promise<void>}
 */
export async function checkData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-scrap-back/cos-scrap-verify-wafer`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  数据保存
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-scrap-back/cos-scrap-back-execute`, {
    method: 'POST',
    body: params,
  });
}
