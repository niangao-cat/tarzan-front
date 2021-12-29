/**
 * 盘装料退料
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-22792/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  条码查询
 * @param params
 * @returns {Promise<void>}
 */
export async function queryList(params) {
  return request(`${prefix}/${organizationId}/feeding-and-withdrawal-ifs/queryMaterialLotDetail`, {
    method: 'POST',
    body: params.materialLotHeadVO,
  });
}

/**
 *  数据汇总
 * @param params
 * @returns {Promise<void>}
 */
export async function calculateData(params) {
  return request(`${prefix}/${organizationId}/feeding-and-withdrawal-ifs/execComputer`, {
    method: 'POST',
    body: params.materialLotHeadVO,
  });
}

/**
 *  提交数据
 * @param params
 * @returns {Promise<void>}
 */
export async function submitData(params) {
  return request(`${prefix}/${organizationId}/feeding-and-withdrawal-ifs/save`, {
    method: 'POST',
    body: params.materialLotHeadVO,
  });
}
