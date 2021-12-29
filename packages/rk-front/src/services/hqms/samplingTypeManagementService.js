/*
 * @Description: 抽样类型管理
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-08 11:41:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 11:36:38
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-19891';

// 获取抽样类型管理数据
export async function fetchTypeManData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-sample-types/list/ui`, {
    method: 'GET',
    query,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${Host}/v1/${organizationId}/qms-sample-types/save/ui`, {
    method: 'POST',
    body: params,
  });
}
