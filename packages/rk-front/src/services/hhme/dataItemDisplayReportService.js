import request from '@/utils/request';
import { Host, ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();

export async function fetchAreaList() {
  return request(`${Host}/v1/${organizationId}/mt-work-order-management/wo-department`, {
    method: 'GET',
  });
}

export async function fetchList(params) {
  const newParams = parseParameters(params);
  const { page, size, ...otherParams } = newParams;
  return request(`${ReportHost}/v1/${organizationId}/hme-tag-checks/list`, {
    method: 'POST',
    body: otherParams,
    query: { page, size },
  });
}

