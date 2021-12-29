import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  console.log("fetchList");
  console.log(params);
  return request(`${ReportHost}/v1/${tenantId}/hme-staff-attribute-report/list`, {
    method: 'GET',
    query: newParams,
  });
}
