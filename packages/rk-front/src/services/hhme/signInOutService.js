import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${prefix}/v1/${tenantId}/hme-sign-in-out-records/sign-in-out-list`, {
    method: 'GET',
    query: newParams,
  });
}
