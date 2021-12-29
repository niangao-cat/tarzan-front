import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId() || 0;

export function fetchList(params) {
  // const newParams = parseParameters(params);
  return request(`${ReportHost}/v1/${tenantId}/distribution-gap-board/data/query`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchProdLineList(query) {
  const queryParams = parseParameters(query);
  return request(`${ReportHost}/v1/${tenantId}/hme-make-center-produce-board/query-kanban-prod-line`, {
    method: 'GET',
    query: queryParams,
  });
}

export async function fetchSiteCode() {
  return request(`${ReportHost}/v1/${tenantId}/hme-make-center-produce-board/query-kanban-config`, {
    method: 'GET',
  });
}