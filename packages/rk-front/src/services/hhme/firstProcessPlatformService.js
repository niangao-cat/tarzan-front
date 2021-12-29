import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

// const Host = '/mes-4279';

const tenantId = getCurrentOrganizationId();

/**
 * 工位编码查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchWorkCellInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}


export function fetchBaseInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/in-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function feedBatchItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-lot-material/release-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function feedTimeItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-time-material/release-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function feedSerialItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-material/release-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function outSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-single/out-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function addDataRecord(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/material-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function updateContainer(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-container/update-container`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchContainerInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-container/detail`, {
    method: 'GET',
    query: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function fetchEquipmentList(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace`, {
    method: 'POST',
    body: params,
  });
}

export function deleteEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/unbinding`, {
    method: 'DELETE',
    body: params,
  });
}

export function bindingEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding`, {
    method: 'POST',
    body: params,
  });
}

export function fetchEqInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/${params.eqCode}`, {
    method: 'GET',
    responseType: 'text',
  });
}

export function bindingEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function changeEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function fetchMaterialList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/release-query`, {
    method: 'POST',
    body: params,
  });
}


export function getOphir(params) {
  return request(`${Host}/v1/${tenantId}/hme-edgink/getOphir`, {
    method: 'GET',
    query: params,
    responseType: 'text',
  });
}

export function getThorlabs(params) {
  return request(`${Host}/v1/${tenantId}/hme-edgink/getThorlabs`, {
    method: 'GET',
    query: params,
    responseType: 'text',
  });
}

export function uninstallContainer(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-container/unload-container`, {
    method: 'POST',
    body: params,
  });
}

export function firstProcessSerialItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/release-scan`, {
    method: 'POST',
    body: params,
  });
}

export function fetchMaterialLotList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/material-lot-lov`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchEoList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/eo-lov`, {
    method: 'GET',
    query: newParams,
  });
}

export function fetchIsContainer(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/query-container`, {
    method: 'POST',
    query: params,
    body: {},
  });
}

export function checkBatchItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-lot-material/batch-update-is-released`, {
    method: 'POST',
    body: params,
  });
}

export function checkTimeItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-time-material/batch-update-is-released`, {
    method: 'POST',
    body: params,
  });
}

export function checkSerialItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-material/batch-update-is-released`, {
    method: 'POST',
    body: params,
  });
}

export function deleteBatchItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-lot-material/delete-lot-material`, {
    method: 'POST',
    body: params,
  });
}

export function deleteTimeItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-time-material/delete-time-material`, {
    method: 'POST',
    body: params,
  });
}

export function deleteSerialItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-material/delete-material`, {
    method: 'POST',
    body: params,
  });
}

export function feedMaterialItem(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/release`, {
    method: 'POST',
    body: params,
  });
}


export function updateLotReleaseQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-lot-material/update-release-qty`, {
    method: 'POST',
    body: params,
  });
}

export function updateTimeReleaseQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-time-material/update-release-qty`, {
    method: 'POST',
    body: params,
  });
}

export function fetchFeedingRecord(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/release-back-query`, {
    method: 'GET',
    query: params,
  });
}

export function returnMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/release-back`, {
    method: 'POST',
    body: params,
  });
}

export function calculate(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/batch-calculation-formula-data`, {
    method: 'POST',
    body: params,
  });
}

export function fetchVirtualNumList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/material-lot/virtual_num`, {
    method: 'POST',
    body: params,
  });
}


export function feedBatchItemCalculation(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/first-process/calculation-result`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDataRecordList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/query-data-record`, {
    method: 'GET',
    query: params,
  });
}


export function fetchSerialItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-material/job-material-query`, {
    method: 'POST',
    body: params,
  });
}

export function fetchBatchItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-lot-material/job-lot-material-query`, {
    method: 'POST',
    body: params,
  });
}

export function fetchTimeItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-time-material/job-time-material-query`, {
    method: 'POST',
    body: params,
  });
}

export function refreshMaterialItemList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/refresh`, {
    method: 'POST',
    body: params,
  });
}


export async function deleteData(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/delete-data-record`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 数据删除
 * @param {*} params
 */
export async function deleteAndBand(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-material/delete-release-material`, {
    method: 'POST',
    body: params,
  });
}

export async function autoCreateSnNum(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/material-lot/first-part`, {
    method: 'GET',
    query: params,
    responseType: 'text',
  });
}

export function scanBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/release-scan`, {
    method: 'POST',
    body: params,
  });
}

export function deleteBarcode(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/delete-material`, {
    method: 'POST',
    body: params,
  });
}

export function feedMaterialList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/release`, {
    method: 'POST',
    body: params,
  });
}

export function fetchWorkCellMaterialList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-single/wkc-bind-query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchESopList(params) {
  const pageParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-ins-heads/esop-query`, {
    method: 'GET',
    query: pageParams,
  });
}
