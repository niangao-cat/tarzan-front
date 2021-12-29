/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 单据执行统计报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-29730/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-instruction-execute/list`, {
    method: 'GET',
    query,
  });
}

// 工厂下拉框
export async function querySiteList() {
  return request(`${Host}/v1/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: {},
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

