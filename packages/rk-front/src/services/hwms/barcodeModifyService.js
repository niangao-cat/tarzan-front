/**
 * 条码修改
 *@date：2020/3/17
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2020,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-20307/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  条码查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryBarcodeList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/material-lot-edit/queryMaterialLotEdit`, {
    method: 'GET',
    query,
  });
}

/**
 * 条码修改
 * @param params
 * @returns {Promise<void>}
 */
export async function updateBarcodeData(params) {
  return request(`${prefix}/${organizationId}/material-lot-edit/updateMaterialLotEdit`, {
    method: 'POST',
    body: params.dtoList,
  });
}
