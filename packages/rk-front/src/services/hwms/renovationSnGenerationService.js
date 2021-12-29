/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 翻新SN生成
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
  return request(`${prefix}/${organizationId}/hme-self-made-repair/scan-original-code`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function submitCode(params) {
  return request(`${prefix}/${organizationId}/hme-self-made-repair/barcode-transform-submit`, {
    method: 'POST',
    body: params,
  });
}

// 打印
export async function print(params) {
  return request(`${prefix}/${organizationId}/hme-mt-eo/print/2`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

