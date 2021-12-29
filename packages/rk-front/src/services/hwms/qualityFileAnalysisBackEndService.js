/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 质量文件解析
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表头数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-quantity-analyze-docs/doc-query`, {
    method: 'GET',
    query,
  });
}

/**
 *  查询报表行数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-quantity-analyze-docs/line-query/${params.qaDocId}`, {
    method: 'GET',
    query,
  });
}

