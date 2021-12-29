/*
 * @Description: 销售发货平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-09 10:21:38
 * @LastEditTime: 2020-12-14 21:29:31
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-17306';

export async function fetchHeadData(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchLineData(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-lines`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchDetail(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-details`, {
    method: 'GET',
    query: params,
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

export async function saveData(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs`, {
    method: 'POST',
    body: params,
  });
}

// 头取消
export async function handleHeadCancel(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs/cancel?instructionDocId=${params.instructionDocId}`, {
    method: 'POST',
    // body: params,
  });
}

// 取消下达
export async function handleCancelRelease(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs/release-cancel?instructionDocId=${params.instructionDocId}`, {
    method: 'POST',
    // body: params,
  });
}

// 下达
export async function handleRelease(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs/release?instructionDocId=${params.instructionDocId}`, {
    method: 'POST',
    // body: params,
  });
}

// 行取消
export async function handleLineCancle(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-lines/cancel?instructionId=${params.instructionId}`, {
    method: 'POST',
    // body: params,
  });
}

export async function getConfigInfo(params) {
  return request(`/hpfm/v1/${organizationId}/profiles`, {
    method: 'GET',
    query: params,
  });
}

export async function getConfigInfoValue(params) {
  return request(`/hpfm/v1/0/profiles/${params.id}`, {
    method: 'GET',
    // query: params,
  });
}

export async function fetchPost(params) {
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-docs/confirm`, {
    method: 'post',
    query: params,
  });
}

export async function fetchDeleteDetail(params) {
  const {voList, ...rest} = params;
  return request(`${Host}/v1/${organizationId}/wms-so-delivery-details`, {
    method: 'delete',
    headers: {
      "content-type": 'application/json',
    },
    body: JSON.stringify(voList),
    query: rest,
  });
}