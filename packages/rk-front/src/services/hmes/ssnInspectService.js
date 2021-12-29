/*
 * @Description: 标准件检验标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-02-01 10:45:11
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;
// const prefix = '/mes-29730'

// 获取头数据
export async function fetchHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-headers`, {
    method: 'GET',
    query: params,
  });
}


// 保存头数据
export async function saveHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-headers/insert`, {
    method: 'POST',
    query: params,
  });
}

// 修改头数据
export async function updateHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-headers/update`, {
    method: 'POST',
    query: params,
  });
}

// 删除头数据
export async function deleteHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-headers/delete`, {
    method: 'POST',
    query: params,
  });
}


// 获取行数据
export async function fetchLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-lines`, {
    method: 'GET',
    query: params,
  });
}


// 保存行数据
export async function saveLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-lines/insert`, {
    method: 'POST',
    body: params.params,
  });
}

// 修改行数据
export async function updateLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-lines/update`, {
    method: 'POST',
    body: params.params,
  });
}

// 删除行数据
export async function deleteLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-lines/delete`, {
    method: 'POST',
    query: params,
  });
}

// 获取行明细数据
export async function fetchDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-details`, {
    method: 'GET',
    query: params,
  });
}


// 保存行明细数据
export async function saveDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-details/insert`, {
    method: 'POST',
    body: params.params,
  });
}

// 修改行明细数据
export async function updateDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-details/update`, {
    method: 'POST',
    body: params.params,
  });
}

// 删除行明细数据
export async function deleteDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-details/delete`, {
    method: 'POST',
    query: params,
  });
}

// 获取头历史记录
export async function getHeaderHistoryData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-headers/ssn-inspect-header-his-query`, {
    method: 'GET',
    query: params,
  });
}
// 获取行历史记录
export async function getLineHistoryData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-ssn-inspect-lines/ssn-inspect-line-his-query`, {
    method: 'GET',
    query: params,
  });
}
