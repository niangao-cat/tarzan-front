/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 在制查询报表
 */

 import request from 'utils/request';
 import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
 // import { Host } from '@/utils/config';
 import { ReportHost } from '@/utils/config';

 const prefix = `${ReportHost}/v1`;
 const organizationId = getCurrentOrganizationId();


 /**
  *  查询报表数据
  * @param params
  * @returns {Promise<void>}
  */
 export async function queryDataList(params) {
   const query = filterNullValueObject(parseParameters(params));
   return request(`${prefix}/${organizationId}/hme-repair-product-pass-rate/day`, {
     method: 'GET',
     query,
   });
 }

 // 查询事业部
 export async function fetchDepartment(params) {
   return request(`/mes/v1/${organizationId}/mt-work-order-management/wo-department`, {
     method: 'GET',
     query: params,
   });
 }

 export async function getExport(params) {
   return request(`${prefix}/${organizationId}/hme-repair-product-pass-rate/day/export`, {
     method: 'POST',
     body: params,
     responseType: 'blob',
   });
 }
