import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${ReportHost}/v1/${tenantId}/Hme-after-sales-quotation/query-after-sales`, {
    method: 'GET',
    query: newParams,
  });
}
