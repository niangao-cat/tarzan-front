/*
 * @Description: 工序不良判定标准维护
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-21 09:36:44
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;
// const prefix = '/mes-29730'

// 获取头数据
export async function fetchHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-headers`, {
    method: 'GET',
    query: params,
  });
}


// 保存头数据
export async function saveHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-headers/insert`, {
    method: 'POST',
    query: params,
  });
}

// 修改头数据
export async function updateHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-headers/update`, {
    method: 'POST',
    query: params,
  });
}

// 删除头数据
export async function deleteHeadData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-headers/delete`, {
    method: 'POST',
    query: params,
  });
}


// 获取行数据
export async function fetchLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-lines`, {
    method: 'GET',
    query: params,
  });
}


// 保存行数据
export async function saveLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-lines/insert`, {
    method: 'POST',
    query: params.params[0],
  });
}

// 修改行数据
export async function updateLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-lines/update`, {
    method: 'POST',
    query: params.params[0],
  });
}

// 删除行数据
export async function deleteLineData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-lines/delete`, {
    method: 'POST',
    query: params,
  });
}

// 获取行明细数据
export async function fetchDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-details`, {
    method: 'GET',
    query: params,
  });
}


// 保存行明细数据
export async function saveDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-details/insert`, {
    method: 'POST',
    query: params.params[0],
  });
}

// 修改行明细数据
export async function updateDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-details/update`, {
    method: 'POST',
    query: params.params[0],
  });
}

// 删除行明细数据
export async function deleteDetailData(params) {
  return request(`${prefix}/v1/${tenantId}/hme-process-nc-details/delete`, {
    method: 'POST',
    query: params,
  });
}
