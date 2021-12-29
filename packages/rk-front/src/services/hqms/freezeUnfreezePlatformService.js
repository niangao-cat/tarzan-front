/*
 * @Description: 冻结解冻平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-22 15:46:35
 * @LastEditTime: 2021-03-04 17:29:00
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}


// 头数据查询
export async function handleFetchHeadList(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs`, {
    method: 'GET',
    query: params,
  });
}

// 行查询
export async function handleFetchLineList(params) {
  const query = parseParameters(params);
  return request(`${Host}/v1/${organizationId}/hme-freeze-doc-lines`, {
    method: 'GET',
    query,
  });
}

// 条码明细数据查询GET /v1/{organizationId}/hme-freeze-doc-lines/load/{materialLotId}
export async function handleFetchBarCodeList(params) {
  const {materialLotId} = params;
  return request(`${Host}/v1/${organizationId}/hme-freeze-doc-lines/load/${materialLotId}`, {
    method: 'GET',
    // query: params,
  });
}

// sn查询
export async function handleFetchSn(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/sn`, {
    method: 'GET',
    query: params,
  });
}

// 导出
export async function handleExport(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}

// 创建
// export async function handleCreate(params) {
//   return request(`${Host}/v1/${organizationId}/hme-freeze-docs`, {
//     method: 'POST',
//     body: params,
//   });
// }

export async function handleCreate(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/create/new`, {
    method: 'POST',
    body: params,
  });
}

// 整单解冻
export async function handleUnfreeze(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/unfreeze`, {
    method: 'POST',
    query: params,
    // body: params,
  });
}

// 行解冻
export async function handleLineUnfreeze(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-doc-lines/unfreeze`, {
    method: 'POST',
    body: params,
  });
}

// 审批
export async function handleApproval(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/approval`, {
    method: 'POST',
    // body: params,
    query: params,
  });
}

export async function freeze(params) {
  return request(`${Host}/v1/${organizationId}/hme-freeze-docs/freeze/new`, {
    method: 'POST',
    // body: params,
    query: params,
  });
}
