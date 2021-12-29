import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchBaseInfo(params) {
  const { workOrderIdList, ...info } = params;
  return request(`${Host}/v1/${tenantId}/hme-wo-dispatch-recodes/list`, {
    method: 'POST',
    query: info,
    body: workOrderIdList,
  });
}

export async function fetchProdLines(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-dispatch-recodes/prod-line/list`, {
    method: 'GET',
    query: params,
  });
}

export async function save(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-dispatch-recodes/save/batch/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function deliveryDemand() {
  return request(`${Host}/v1/${tenantId}/wms-component-demand-records/distribution-demand`, {
    method: 'POST',
  });
}

export async function fetchLimitDate(params) {
  return request(`/hpfm/v1/${tenantId}/profile-value`, {
    method: 'GET',
    query: params,
    responseType: 'text',
  });
}

export async function fetchNumberSets(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-dispatch-recodes/suite?siteId=${params.siteId}&tenantId=${params.tenantId}`, {
    method: 'POST',
    body: params.paramList,
  });
}

export async function fetchSuiteDetail(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-wo-dispatch-recodes/suite/detail`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
