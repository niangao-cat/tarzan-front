// 引入依赖
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// const host = '/mes-19891';
/**
 * @Description: 查询头信息
 * @author: ywj
 * @date 2020/3/17 15:14
 * @version 1.0
 */
export async function fetchPurchaseOrderHeadList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/purchase-order/list/ui/head`, {
    method: 'GET',
    query: param,
  });
}

/**
 * @Description: 查询行信息
 * @author: ywj
 * @date 2020/3/17 15:14
 * @version 1.0
 */
export async function fetchPurchaseOrderLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/purchase-order/list/ui/line`, {
    // return request(`${Host}/v1/${tenantId}/purchase-order/list/ui/line`, {
    method: 'GET',
    query: param,
  });
}

/**
 * @Description: 送货单创建
 * @author: hxy
 * @version 1.0
 */
export async function fetchCreateOrder(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-po-delivery/gen-po-delivery-data`, {
    method: 'POST',
    body: param,
  });
}

/**
 * @Description: 生成单号，如果传了采购订单行，还能处理合并行数据
 * @author: hxy
 * @version 1.0
 */
export async function fetchGeneratePoDeliveryNum(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-po-delivery/gen-po-delivery-number`, {
    method: 'POST',
    body: param,
  });
}

/**
 * @Description: 获取可制单数
 * @author: hxy
 * @version 1.0
 */
export async function fetchCorverNum(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-po-delivery/get-avail-quantity`, {
    method: 'POST',
    body: param,
  });
}

/**
 * 查询明细数据
 */
export async function fetchDetailData(params) {
  return request(`${Host}/v1/${tenantId}/qms-invoice/${params.instructionId}`, {
    method: 'GET',
  });
}

/**
 * 外协创建查询
 */
export async function fetchOutLineForBoom(params) {
  return request(`${Host}/v1/${tenantId}/qms-invoice/invoice/query`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 外协创建
 */
export async function createOutSource(params) {
  return request(`${Host}/v1/${tenantId}/qms-invoice/invoice/create`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 外协发货单创建查询
 */
export async function fetchOutsourceInvoiceQuery(params) {
  return request(`${Host}/v1/${tenantId}/qms-invoice/outsource/invoice/query`, {
    method: 'POST',
    body: params,
  });
}
