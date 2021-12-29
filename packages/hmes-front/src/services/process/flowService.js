import request from '@/utils/request';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

export async function fetchTableList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/list/ui`, {
    method: 'GET',
    query: param,
  });
}

export async function fetchStatusOption(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

export async function saveList(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/save/ui`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteItem(params) {
  return request(`${Host}/v1/${tenantId}/mt-operation-wkc-dispatch-rel/delete/ui`, {
    method: 'POST',
    body: Object.values(params)[0],
  });
}
