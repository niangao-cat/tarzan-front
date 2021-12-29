/**
 * 锡膏/红胶管理
 *@date：2019/10/30
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-24233/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  锡膏/红胶查询头列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-solder-glue/mainQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  锡膏/红胶查询明细列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-solder-glue/historyQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  产线数据查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryProductLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-solder-glue/prodLineQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  锡膏/红胶管理——扫描条码
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataByCode(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-solder-glue/manageQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  锡膏红胶操作
 * @param params
 * @returns {Promise<void>}
 */
export async function operate(params) {
  return request(`${prefix}/${organizationId}/wms-solder-glue/manage/${params.operate}`, {
    method: 'POST',
    body: { ...params },
  });
}
