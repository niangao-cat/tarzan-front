
// 销售订单变更
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 数据查询
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-transfer/so-query`, {
    method: 'GET',
    query: params,
  });
}

// 数据保存
export async function saveSampleCode(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-transfer/so-confirm`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function querySiteList() {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/get/site`, {
    method: 'GET',
  });
}
