/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 接口层
 */

// 引入必要依赖包
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

// const Host = '/mes-27947';
const organizationId = getCurrentOrganizationId();

// 查询头信息
export async function queryHeadData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/list/head/ui`, {
    method: 'GET',
    query,
  });
}

// 查询行信息
export async function queryLineData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/list/line/ui`, {
    method: 'GET',
    query,
  });
}

// 查询退货行信息
export async function queryReturnLineData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/create/return/head/doc`, {
    method: 'GET',
    query,
  });
}

// 创建外协单据数据
export async function createOutSourceData(params) {
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/create/return/doc`, {
    method: 'POST',
    body: params,
  });
}

// 创建补料单据数据
export async function createOutReturnSourceData(params) {
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/create/replenishment/ui`, {
    method: 'POST',
    body: params,
  });
}

// 关闭单据
export async function closeOutData(params) {
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/close/return/doc`, {
    method: 'POST',
    body: params,
  });
}


// 查询行明细
export async function fetchLineDetail(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/list/detail/ui`, {
    method: 'GET',
    query,
  });
}

// 打印
export async function printData(params) {
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/pdf`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 创建补料单数据
export async function queryCreateReturn(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/create/header/query`, {
    method: 'GET',
    query,
  });
}

// 查询剩余库存
export async function queryHavingQty(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/wms-outsource-manage-platform/query/inventory/quantity`, {
    method: 'GET',
    query,
  });
}
