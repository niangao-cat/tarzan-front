/*
 * @Description: 抽样方案定义
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 15:59:21
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 抽样数据
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/qms-sample-schemes/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 抽样数据创建
export async function savePlanDef(params) {
  return request(`${Host}/v1/${organizationId}/qms-sample-schemes/save/ui`, {
    method: 'POST',
    body: params,
  });
}
