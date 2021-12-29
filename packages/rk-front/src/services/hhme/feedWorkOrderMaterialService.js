import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-8736';

const tenantId = getCurrentOrganizationId();

/**
 * 扫描工单号，工单信息查询
 * @async
 * @function fetchWorkOrderInfo
 */
export async function fetchWorkOrderInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-input-records/wo/${params}`, {
    method: 'GET',
  });
}

export async function fetchFeedingMaterialRecord(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-wo-input-records/record`, {
    method: 'GET',
    query: newParams,
  });
}

export async function save(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-input-records/wo-input`, {
    method: 'POST',
    body: params,
  });
}

export async function scanBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-input-records/code-scan`, {
    method: 'GET',
    query: params,
  });
}

export async function returnMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-wo-input-records/wo-output`, {
    method: 'POST',
    body: params,
  });
}
