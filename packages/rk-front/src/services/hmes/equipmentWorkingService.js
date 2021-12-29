/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-14 11:11:42
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const prefix = '/mes-29730';

// 设备查询
export async function fetcheEuipmentWorking(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/hme-equipment-working`, {
    method: 'GET',
    query,
  });
}

// 设备查询
export async function exportData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/hme-equipment-working/export`, {
    method: 'GET',
    responseType: 'blob',
    query,
  });
}

