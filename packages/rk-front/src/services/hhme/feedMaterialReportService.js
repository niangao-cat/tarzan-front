import request from '@/utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-8736';

const tenantId = getCurrentOrganizationId();


export async function fetchList(params) {
  const { page, ...newParams } = params;
  const query = parseParameters({page});
  return request(`/mes-report/v1/${tenantId}/hme-input_record`, {
    method: 'POST',
    query,
    body: newParams,
  });
}
