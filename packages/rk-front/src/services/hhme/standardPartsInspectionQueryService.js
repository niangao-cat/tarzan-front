/*
 * @Description: 标准件查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-04 10:57:25
 * @LastEditTime: 2021-02-04 11:26:10
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function snReplace(params) {
  return request(`${prefix}/v1/${tenantId}/hme-sn-replace/sn-replace`, {
    method: 'POST',
    body: params,
  });
}

export async function handleFetchHeadList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/ssn-inspect-result/header-lines`, {
    query: { page: params.page, size: params.size },
    method: 'POST',
    body: newParams,
  });
}

export async function handleFetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/ssn-inspect-result/lines`, {
    method: 'GET',
    query: newParams,
  });
}