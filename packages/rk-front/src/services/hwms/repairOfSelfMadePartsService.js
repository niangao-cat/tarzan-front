import request from '@/utils/request';
import { Host } from '@/utils/config';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  parseParameters,
} from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 *  信息查询
 * @param params
 * @returns {Promise<void>}
 */
export async function fetchData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-self-made-repair?materialLotCode=${query.materialLotCode}`, {
    method: 'GET',
  });
}

/**
 * 信息保存
 */
export function saveData(params) {
  return request(`${Host}/v1/${tenantId}/hme-self-made-repair`, {
    method: 'POST',
    body: params,
  });
}
