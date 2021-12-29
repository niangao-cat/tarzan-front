
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();


/**
 *  巡检单头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/qms-pqc-doc-query/list/header/ui`, {
    method: 'GET',
    query,
  });
}

/**
 *  巡检行列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/qms-pqc-doc-query/list/line/ui`, {
    method: 'GET',
    query,
  });
}

/**
 *  巡检单行明细
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineDetailList(params) {
    const query = filterNullValueObject(parseParameters(params));
    return request(`${prefix}/${organizationId}/qms-pqc-doc-query/list/details/ui`, {
      method: 'GET',
      query,
    });
  }



