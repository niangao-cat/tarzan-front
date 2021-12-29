import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
// import { Host } from '@/utils/config';

// const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();


/**
 *  列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`/mes-report/v1/${organizationId}/hme-cos-workcell-exception`, {
    method: 'GET',
    query,
  });
}

