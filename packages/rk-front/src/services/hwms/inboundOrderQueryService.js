/*
 * @Description: 入库单查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-09-11 09:53:09
 * @LastEditTime: 2020-09-11 19:57:03
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';

const tenantId = getCurrentOrganizationId();

// 查询头数据
export async function fetchHeadList(params) {
  return request(`${Host}/v1/${tenantId}/wms-product-receipt/receipt-doc-query`, {
    method: 'GET',
    query: params,
  });
}

// 查询行数据
export async function fetchLineList(params) {
  return request(`${Host}/v1/${tenantId}/wms-product-receipt/receipt-doc-line-query`, {
    method: 'GET',
    query: params,
  });
}

// 明细查询
export async function fetchLineDetail(params) {
  return request(`${Host}/v1/${tenantId}/wms-product-receipt/receipt-doc-line-detail`, {
    method: 'GET',
    query: params,
  });
}

// 头打印
export async function headPrint(params) {
  return request(`${Host}/v1/${tenantId}/wms-product-receipt/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 单据撤销
export async function headCancelDoc(params) {
  return request(`${Host}/v1/${tenantId}//wms-product-receipt/retract-receipt-doc`, {
    method: 'POST',
    body: params,
  });
}
