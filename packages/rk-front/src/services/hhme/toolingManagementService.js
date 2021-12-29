import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-4279';

const tenantId = getCurrentOrganizationId();

/**
 * 工位编码查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchWorkCellInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-tools/workcell-scan`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchToolingList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-tools/query/tool`, {
    method: 'GET',
    query: newParams,
  });
}

export async function save(params) {
  return request(`${Host}/v1/${tenantId}/hme-tools/save/tool`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
