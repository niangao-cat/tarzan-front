/**
 * author: ywj
 * des:质检员与物料组关系维护
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
  return request(`${prefix}/${organizationId}/hme-inspector-item-group-rels`, {
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
  return request(`${prefix}/${organizationId}/hme-inspector-item-group-rels`, {
    method: 'POST',
    body: params.saveData,
  });
}
