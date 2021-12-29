import request from '@/utils/request';
import {
  getCurrentOrganizationId,
  parseParameters,
} from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `/mes-report`;

export function fetchList (params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-cos-attrition-sum`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}
