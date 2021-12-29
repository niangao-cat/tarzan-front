/**
 * @description SAP与MES库存核对报表
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:11
 * @version 0.0.1
 * @return
 */

import request from 'utils/request';
import { getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  // const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/itf-sap-on-hand/on-hand-report`, {
    method: 'POST',
    body: params,
  });
}
