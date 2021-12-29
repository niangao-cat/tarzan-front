import request from '@/utils/request';
import {
  getCurrentOrganizationId,
  parseParameters,
} from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export function fetchList (params) {
  const newParams = parseParameters(params);
  return request(`/mes-report/v1/${tenantId}/hme-distribution-demands`, {
    method: 'GET',
    query: newParams,
  });
}
