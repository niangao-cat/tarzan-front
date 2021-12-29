/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 售后退库检测查询报表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost, Host } from '@/utils/config';

const prefixReport = `${ReportHost}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefixReport}/${organizationId}/service-return-check`, {
    method: 'GET',
    query,
  });
}


/**
 *  工厂下拉框
 * @returns {Promise<void>}
 */
export async function fetchSiteList() {
  return request(`${Host}/v1/${organizationId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
  });
}


/**
 * 默认站点信息
 *
 * @export
 * @returns
 */
export function fetchDefaultSite () {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}