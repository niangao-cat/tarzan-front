/**
 * labCodeInputService - 实验代码录入
 * *
 * @date: 2021/10/27 14:49:38
 * @author: zhaohuiLiu <zhaohui.liu@hand-china.com>
 * @copyright: Copyright (c) 2018, Hand
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
