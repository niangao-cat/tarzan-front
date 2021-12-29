/**
 * 物料查询
 *@date：2019/9/17
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
 *  物料查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryMaterialList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/materialDataMaintain`, {
    method: 'GET',
    query,
  });
}

/**
 *  BIN查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryBINList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/materialDataMaintain/materialBinQuery`, {
    method: 'GET',
    query,
  });
}
