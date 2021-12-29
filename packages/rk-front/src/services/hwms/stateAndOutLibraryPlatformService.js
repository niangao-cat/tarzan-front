/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// const Host = '/mes-28232';

// 查询头信息
export async function fetchDocHead (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/head-query`, {
    method: 'GET',
    query: params,
  });
}

// 查询行信息
export async function fetchDocLineList (params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/line-query`, {
    method: 'GET',
    query: param,
  });
}

// 查询SN信息
export async function fetchSnSpecifyList (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-specified`, {
    method: 'POST',
    body: params,
  });
}

// 查询SN批量输入可编辑校验
export async function fetchSnEdit (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-edit?instructionId=${params.instructionId}&sn=${params.sn}`, {
    method: 'GET',
    // query: params,
  });
}

// SN批量录入
export async function fetchSnBatchEntry (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-batch-insert`, {
    method: 'POST',
    body: params,
  });
}

// SN录入保存
export async function fetchSnSave (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-batch-insert-save`, {
    method: 'POST',
    body: params,
  });
}

// SN保存删除
export async function fetchSnDelEte (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-delete`, {
    method: 'POST',
    body: params,
  });
}

// 出库信息
export async function fetchOutLibrarySpecifyList(params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/mainQuery`, {
    method: 'GET',
    query: params,
  });
}

// 出库信息表格
export async function fetchOutLibrarySpecifyTable(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/figure`, {
    method: 'GET',
    query: param,
  });
}

// 出库
export async function fetchSnOutLibrary (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/sn-batch-outbound`, {
    method: 'POST',
    body: params,
  });
}

// 取消
export async function cancelSnOutLibrary (params) {
  return request(`${Host}/v1/${tenantId}/wms-standing-outbound/cancel`, {
    method: 'POST',
    body: params,
  });
}

// 工厂下拉框
export async function querySiteList() {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: {},
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
