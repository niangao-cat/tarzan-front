import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

// 查询数据
export async function fetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/wms-distribution-basic-datas/query`, {
    method: 'GET',
    query: newParams,
  });
}

// 新增数据
export async function addHeadList(params) {
  return request(`${prefix}/v1/${tenantId}/wms-distribution-basic-datas/create`, {
    method: 'POST',
    body: params,
  });
}

// 更新数据
export async function updateHeadList(params) {
    return request(`${prefix}/v1/${tenantId}/wms-distribution-basic-datas/update`, {
      method: 'POST',
      body: params,
    });
  }
