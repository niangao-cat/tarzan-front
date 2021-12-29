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

export async function fetchBaseInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/in-site-scan`, {
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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/out-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function lotOutSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/batch-out-site-scan`, {
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


export function fetchSnList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/list-for-sn`, {
    method: 'GET',
    query: params,
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
export function checkEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/list-for-sn`, {
    method: 'GET',
    query: params,
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

export function fetchCompletedMaterialInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/material-prepared`, {
    methods: 'GET',
    query: params,
  });
};

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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-beyond-material`, {
    method: 'GET',
    query: params,
  });
}

export function saveMaterialList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-beyond-material/batch-save`, {
    method: 'POST',
    body: params,
  });
}

export function deleteMaterialList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-beyond-material/batch-remove`, {
    method: 'DELETE',
    body: params,
  });
}

export function addDataRecordBatch(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/batch-save`, {
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

export function deleteAddDataRecordList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/delete-supplement-record`, {
    method: 'POST',
    body: params,
  });
}

export function uninstallContainer(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-container/unload-container`, {
    method: 'POST',
    body: params,
  });
}

export function scanFirstProcessSnNum(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/in-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export function fetchIsInMaterialLot(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-first-process/query-material-lot`, {
    method: 'POST',
    query: params,
    body: {},
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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/release-back`, {
    method: 'POST',
    body: params,
  });
}

export function calculate(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/calculation-formula-data`, {
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

export function fetchLocationInfo(params) {
  const { page, ...newParams } = params;
  const pageParams = parseParameters({page});
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/locator-onhand-query`, {
    method: 'POST',
    body: newParams,
    query: pageParams,
  });
}

/**
 * 查询组件下面装配清单表格数据
 * @async
 * @function fetchBomList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchBomList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-eo/bom-list/ui`, {
    method: 'GET',
    query: param,
  });
}

export function fetchBackMaterialInfo(params) {
  const { page, ...newParams } = params;
  const pageParams = parseParameters({page});
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/back-flush-query`, {
    method: 'POST',
    body: newParams,
    query: pageParams,
  });
}

export async function fetchBatchBaseInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/in-site-scan`, {
    method: 'POST',
    body: params,
  });
}


export async function clickSnList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/in-site-query`, {
    method: 'POST',
    body: params,
  });
}

export async function checkSn(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/in-site-scan-check`, {
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


