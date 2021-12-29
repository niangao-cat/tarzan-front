/*
 * @Description: 条码查询
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-14 19:33:29
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-10 09:57:51
 * @Copyright: Copyright (c) 2019 Hand
 */
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
// const prefix = `/mes-29730/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  条码查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryBarcodeList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/pc-material-lot/barCodeQuery`, {
    method: 'GET',
    query,
  });
}

/**
 *  条码历史查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryBarcodeHistoryList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/pc-material-lot/barCodeQueryHis`, {
    method: 'GET',
    query,
  });
}

/**
 * 条码创建
 * @param params
 * @returns {Promise<void>}
 */
export async function createBarcodeData(params) {
  return request(`${prefix}/${params.tenantId}/pc-material-lot/save`, {
    method: 'POST',
    body: { ...params },
  });
}

/**
 *  查询创建原因
 * @returns {Promise<void>}
 */
export async function queryCreateReason() {
  return request(`${prefix}/${organizationId}/mt-gen-type/limit-group/type`, {
    method: 'POST',
    body: {
      module: 'MATERIAL_LOT',
      typeGroup: 'CREATE_REASON',
    },
  });
}

/**
 * 条码打印
 * @param params
 * @returns {Promise<void>}
 */
export async function printingBarcode(params) {
  return request(`${prefix}/${organizationId}/wms-material-log-print/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 条码查询-cos
export async function printingBarcodeCos(params) {
  return request(`${prefix}/${organizationId}/wms-material-log-print/print/${params.type}`, {
    method: 'POST',
    body: params.codeList,
    responseType: 'blob',
  });
}

// 工厂信息
export async function fetchSite() {
  return request(`${prefix}/${organizationId}/pc-material-lot/property`, {
    method: 'GET',
  });
}


/**
 * 条码创建
 * @param params
 * @returns {Promise<void>}
 */
export async function createRDNum(params) {
  return request(`${prefix}/${params.tenantId}/pc-material-lot/new`, {
    method: 'POST',
    body: { ...params },
  });
}


/**
 *  实验代码查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLabCodeList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-material-lot-lab-codes/labCode`, {
    method: 'GET',
    query,
  });
}

/**
 * 工艺实验代码查询列表
 * @async
 * @function fetchDocPrivilegeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 */
export async function fetchOperationLabCodeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/hme-sn-lab-codes/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存工艺实验代码
 * @async
 * @function saveDocPrivilege
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveOperationLabCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-sn-lab-codes/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// 站点查询
export async function fetchSiteList(params) {
  return request(`${Host}/v1/${organizationId}/site`, {
    method: 'GET',
    query: params,
  });
}

