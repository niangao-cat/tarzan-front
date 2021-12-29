/**
 * author: ywj
 * des:不良代码指定工艺路线维护
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-20307/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-nc-code-router-rels/list`, {
    method: 'GET',
    query,
  });
}

/**
 * 修改/新增
 * @param params
 * @returns {Promise<void>}
 */
export async function updateData(params) {
  return request(`${prefix}/${organizationId}/hme-nc-code-router-rels/save`, {
    method: 'POST',
    body: params.saveData,
  });
}

/**
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHistoryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-nc-code-router-rel-hiss/list`, {
    method: 'GET',
    query,
  });
}
