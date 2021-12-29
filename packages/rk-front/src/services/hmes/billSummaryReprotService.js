/*
 * @Description: service
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-23 10:55:50
 * @LastEditTime: 2021-02-26 11:37:43
 */

import request from '@/utils/request';
// import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
const Host = '/mes-report';

export async function handleFetchList(params) {
  return request(`${Host}/v1/${organizationId}/doc-summary`, {
    method: 'GET',
    query: params,
  });
}
