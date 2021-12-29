/*
 * @Description: 工装维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-07 17:55:09
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-29730/v1`;
const organizationId = getCurrentOrganizationId();

// 查询列表数据
export async function handleSearch(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-tools`, {
    method: 'GET',
    query,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${prefix}/${organizationId}/hme-tools`, {
    method: 'POST',
    body: params.params,
  });
}

// 查询修改记录数据
export async function handhistory(params) {
  const param = parseParameters(params);
  return request(`${prefix}/${organizationId}/hme-tool-his`, {
    method: 'GET',
    query: param,
  });
}