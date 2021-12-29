/**
 * service
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-19563/v1`;
const organizationId = getCurrentOrganizationId();

export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/itf-object-transaction-ifaces/list`, {
    method: 'GET',
    query,
  });
}


export async function saveOne(params) {
  return request(`${prefix}/${organizationId}/itf-object-transaction-ifaces/update`, {
    method: 'POST',
    body: params,
  });
}
