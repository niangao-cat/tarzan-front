/**
 * 现有量查询
 *@date：2020/4/19
 *@author：zzc <zhicen.zhang@hand-china.com>>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import request from 'utils/request';
import { filterNullValueObject, getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-inv-onhand-quantity/onhandQuantityQuery`, {
    method: 'POST',
    query,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}

// 获取默认工厂
export async function fetchDefaultSite(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}


