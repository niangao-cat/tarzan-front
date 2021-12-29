import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-28621';

const tenantId = getCurrentOrganizationId();

/**
 * 工位编码查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchWorkCellInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-equipment/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 默认站点
 *
 * @export
 * @returns
 */
export function fetchDefaultSite () {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}


/**
 * 设备信息
 *
 * @export
 * @param {*} params
 * @returns
 */
export function fetchEquipmentInfo (params) {
  return request(`/mes/v1/${tenantId}/hme-equipment/one/ui`, {
    method: 'GET',
    query: params,
  });
}


/**
 * 点检信息
 *
 * @export
 * @param {*} params
 * @returns
 */
export function fetchCheckInfo (params) {
  const newParams = parseParameters(params);
  return request(`/mes/v1/${tenantId}/hme-equipment/equipment/content`, {
    method: 'GET',
    query: newParams,
  });
}


/**
 * 保养信息
 *
 * @export
 * @param {*} params
 * @returns
 */
export function fetchMaintenanceInfo(params) {
  const newParams = parseParameters(params);
  return request(`/mes/v1/${tenantId}/hme-equipment/maintain/content`, {
    method: 'GET',
    query: newParams,
  });
}


/**
 * 更新点检/保养结果
 *
 * @export
 * @param {*} params
 * @returns
 */
export function addResult(params) {
  return request(`/mes/v1/${tenantId}/hme-equipment/equipment/update`, {
    method: 'POST',
    body: params,
  });
}


export function saveRemark(params) {
  return request(`/mes/v1/${tenantId}/hme-equipment/maintain-equipment-update`, {
    method: 'POST',
    body: params,
  });
}




