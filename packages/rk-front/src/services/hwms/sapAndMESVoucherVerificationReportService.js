/**
 * @description SAP与MES凭证核对报表
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
  return request(`${prefix}/${organizationId}/itf-sap-material-voucher/material-voucher-difference`, {
    method: 'POST',
    body: params,
  });
}
