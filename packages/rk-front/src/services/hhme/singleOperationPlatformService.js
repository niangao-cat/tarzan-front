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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-single/in-site-scan`, {
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

export async function lotOutSite(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/batch-out-site-scan`, {
    method: 'POST',
    body: params,
  });
}

export async function addDataRecord(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-data-record/result-save-single`, {
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

export function fetchDefaultSite() {
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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/release-query`, {
    method: 'POST',
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

export function uninstallContainer(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-container/unload-container`, {
    method: 'POST',
    body: params,
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

export function fetchFeedingRecord(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/release-back-query`, {
    method: 'GET',
    query: params,
  });
}

export function returnMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-batch/release-back`, {
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


export function fetchLocationInfo(params) {
  const { page, ...newParams } = params;
  const pageParams = parseParameters({ page });
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
  const pageParams = parseParameters({ page });
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn/back-flush-query`, {
    method: 'POST',
    body: newParams,
    query: pageParams,
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

/**
 * 数据删除
 * @param {*} params
 */
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
  return request(`${Host}/v1/${tenantId}/hme-eo-job-sn-single/release`, {
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

export function fetchEOList(params) {
  const pageParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-operation-ins-heads/no-out-eo`, {
    method: 'GET',
    query: pageParams,
  });
}

export function fetchSnDataList(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-checks/query-sn-list`, {
    method: 'GET',
    query: params,
  });
}

export function fetchPumpList(params) {
  return request(`${Host}/v1/${tenantId}/hme_pumping_sources/hme-pumping-source-query`, {
    method: 'GET',
    query: params,
  });
}

export function fetchComponentDataList(params) {
  return request(`${Host}/v1/${tenantId}/hme-tag-checks/query-component-list`, {
    method: 'GET',
    query: params,
  });
}