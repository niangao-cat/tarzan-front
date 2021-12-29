/*
 * @Description: IQC免检设置
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-29 09:35:40
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-07-21 22:28:52
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-27947';

// 免检数据
export async function queryIQCfree(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-material-insp-exempts/list/ui`, {
    method: 'GET',
    query,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 创建免检数据
export async function createFreeData(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-insp-exempts/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// 删除免检数据
export async function deleteFreeData(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-insp-exempts/remove/ui`, {
    method: 'POST',
    body: params.selectedRows,
  });
}
