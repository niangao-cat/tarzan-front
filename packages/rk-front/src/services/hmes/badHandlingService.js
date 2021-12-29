/*
 * @Description: 不良处理平台
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-02 11:45:55
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';
const organizationId = getCurrentOrganizationId();

// 主查询
export async function handleSearch(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/list`, {
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

// 扫描条码-头扫描
export async function enterBarCodeHead(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/lot/sn`, {
    method: 'GET',
    query: params,
  });
}

// 扫描条码-行扫描
export async function enterBarCodeLine(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/line/material/lot`, {
    method: 'GET',
    query: params,
  });
}

// 工序不良提交
export async function processBadCommit(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/process/nc/create`, {
    method: 'POST',
    body: params,
  });
}

// 材料不良提交
export async function materialBadCommit(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/nc/create`, {
    method: 'POST',
    body: params,
  });
}

// 头上加号扫描的条码扫描
export async function saveHeadBarCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/lot/submit`, {
    method: 'POST',
    body: params,
  });
}

// 行上条码扫描保存
export async function saveLineBarCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/line/material/lot/submit`, {
    method: 'POST',
    body: params,
  });
}

// 不良记录单独查询
export async function fetchBadRecord(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/nc/record/list`, {
    method: 'GET',
    query: params,
  });
}

// 查询物料清单
export async function fetchMaterialList(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/page`, {
    method: 'GET',
    query: params,
  });
}

// 工序-不良类型更多
export async function fetchProcessBadType(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/process/typs`, {
    method: 'GET',
    query: params,
  });
}

// 材料-不良类型更多
export async function fetchMaterialBadType(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/typs`, {
    method: 'GET',
    query: params,
  });
}

// 其他工位
export async function fetchOtherStation(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/other/workcell`, {
    method: 'GET',
    query: params,
  });
}

export async function scanningMaterialLotCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/${params.materialLotCode}`, {
    method: 'GET',
    query: params,
  });
}

// 自动查询备注
export async function fetchComments(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/comments`, {
    method: 'GET',
    query: params,
  });
}

// 删除条码
export async function deleteBarcode(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/material/page/delete`, {
    method: 'POST',
    body: params.record,
  });
}

// 校验条码
export async function handleCheckBarCode(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/cos-material-judge`, {
    method: 'POST',
    body: params,
  });
}

// 查询cos信息
export async function handleFetchCosInfo(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/cos-load-query`, {
    method: 'POST',
    body: params,
  });
}

// 工位查询
export async function queryWorkcellId(params) {
  return request(`${Host}/v1/${organizationId}/hme-nc-dispose-platform/workcell-scan`, {
    method: 'GET',
    query: params,
  });
}