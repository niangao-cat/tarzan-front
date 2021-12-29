/*
 * @Description: FAC-Y宽判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-04 10:45:11
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;
// const prefix = '/mes-29732'

// 获取头数据
export async function fetchHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-fac-yks`, {
    method: 'GET',
    query: params,
  });
}


// 保存头数据
export async function saveHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-fac-yks`, {
    method: 'POST',
    query: params,
  });
}

// 修改头数据
export async function updateHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-fac-yks`, {
    method: 'PUT',
    query: params,
  });
}

// 删除头数据
export async function deleteHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-fac-yks`, {
    method: 'DELETE',
    query: params,
  });
}

// 获取历史记录
export async function getHistoryData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-fac-yks/his-list-query`, {
    method: 'GET',
    query: params,
  });
}
