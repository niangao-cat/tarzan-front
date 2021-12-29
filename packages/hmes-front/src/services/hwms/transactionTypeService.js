/**
 * 事务类型维护
 *@date：2019/10/18
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
 *  查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/transaction-type/query/list`, {
    method: 'GET',
    query,
  });
}

/**
 * 保存数据
 * @param params
 * @returns {Promise<void>}
 */
export async function saveData(params) {
  return request(`${prefix}/${params.tenantId}/transaction-type/save`, {
    method: 'POST',
    body: { ...params },
  });
}
