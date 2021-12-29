import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();
const host = '/mes';
// const host = '/mes-32410';

/**
 * 查询列表
 * @async
 */
export async function queryList(params) {
  // console.log('params==', params);
  const param = filterNullValueObject(parseParameters(params));
  return request(`${host}/v1/${tenantId}/wms-material-lot-frozen/ui-query`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 冻结 解冻
 * @async
 * @function freeze
 */
export async function freezeOrThaw(params) {
  return request(`${host}/v1/${tenantId}/wms-material-lot-frozen/execute`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
  });
}

// 仓库列表
export async function queryWarehouseList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/warehouse/get`, {
    method: 'GET',
    query: param,
  });
}
// 貨位列表
export async function queryLocatorList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/locator/get`, {
    method: 'GET',
    query: param,
  });
}
