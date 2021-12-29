/**
 *通用数据锁定
 *@date：2020/9/15
 *@author：xinyu.wang <xinyu.wang02@hand-china.com>
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
 *  锁定记录查询
 * @param params
 * @returns {Promise<void>}
 */
export async function recordLocksQuery(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-object-record-locks`, {
    method: 'GET',
    query,
  });
}

// 解除锁定
export async function releaseLock(params) {
  return request(`${Host}/v1/${organizationId}/hme-object-record-locks/admin/release-lock`, {
    method: 'POST',
    body: params,
  });
}
