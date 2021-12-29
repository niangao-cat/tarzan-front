/*
 * @Description: 样本量字码维护
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-07 09:17:19
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-13 15:18:31
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 样本量字码维护
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/qms-sample-size-code-letters/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 创建免检数据
export async function saveSampleCode(params) {
  return request(`${Host}/v1/${organizationId}/qms-sample-size-code-letters/save/ui`, {
    method: 'POST',
    body: params,
  });
}
