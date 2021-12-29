// 芯片预挑选
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 输入工位
export async function enterSite(params) {
  return request(`/mes/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 查询左上侧信息
export async function queryLeftTopData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/workorder/query`, {
    method: 'GET',
    query,
  });
}

// 查询右侧上部信息
export async function queryRightTopData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/select/rule`, {
    method: 'GET',
    query,
  });
}

// 查询左侧下部信息
export async function queryLeftButtomData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/select/lot`, {
    method: 'GET',
    query,
  });
}

// 查询中侧下部信息
export async function queryCenterButtomData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/material/lot`, {
    method: 'GET',
    query,
  });
}

// 查询中侧下部信息/明细信息
export async function queryCenterButtomDetailData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/select/details`, {
    method: 'GET',
    query,
  });
}

// 查询右侧下部信息
export async function queryRightButtomData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/material/lot/to`, {
    method: 'GET',
    query,
  });
}

// 查询右侧要装入盒子
export async function queryPreBarcode(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/getmateriallot`, {
    method: 'GET',
    query,
  });
}

// 查询右侧要装入盒子
export async function queryPreBarcodeByContainer(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/materialLot-query-container`, {
    method: 'GET',
    query,
  });
}

// 校验扫描的条码
export async function checkBarcode(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/materialLot-query`, {
    method: 'GET',
    query,
  });
}

// 更新扫描到的条码
export async function reQueryBarcode(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/materialLot-query-update`, {
    method: 'GET',
    query,
  });
}

// 查询批次对应的信息
// 校验扫描的条码
export async function queryDataByLot(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/select-lot-query`, {
    method: 'GET',
    query,
  });
}


// 确认生成规则
export async function confirmData(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/confirm-new`, {
    method: 'POST',
    body: params,
  });
}

// 装入数据
export async function doInBox(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/load/details`, {
    method: 'POST',
    body: params,
  });
}

// 装入新数据
export async function doInBoxNew(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/load/details/new`, {
    method: 'POST',
    body: params,
  });
}


// 查询未装数据
export async function queryNoHavingData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/select-lot-query-else`, {
    method: 'GET',
    query,
  });
}

// 查询剩余芯片数
export async function fetchSurplusChipNum(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/qty-query-container`, {
    method: 'GET',
    query: params,
  });
}

// 库位转移
export async function handleLocationMove(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/transfer`, {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function doWithdraw(params) {
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/recall`, {
    method: 'POST',
    body: params,
  });
}

// 查询未装数据
export async function queryDataByWithdraw(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/hme-pre-selections/recall-data-query`, {
    method: 'GET',
    query,
  });
}

