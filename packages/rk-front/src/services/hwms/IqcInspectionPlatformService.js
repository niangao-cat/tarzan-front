/**
 * @Description: IQC检验平台Service层
 * @author: ywj
 * @date 2020/5/15 9:52
 * @version 1.0
 */

// 引入必要的依赖包
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';
import { parseParametersMes } from '@/utils/utils';

// 获取组织Id
const organizationId = getCurrentOrganizationId();
const prefix = `${Host}/v1`;

// 数据查询
export async function queryBaseData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/main/query`, {
    method: 'GET',
    query: param,
  });
}

// 头数据查询
export async function queryInspectHeadData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/iqc/head/query`, {
    method: 'GET',
    query: param,
  });
}

// 数据查询
export async function queryBook(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/quality-file-query`, {
    method: 'GET',
    query: param,
  });
}


// 数据查询
export async function bookShowOne(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/quality-file-import-query`, {
    method: 'GET',
    query: param,
  });
}


// 行数据查询
export async function queryInspectLineData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/iqc/line/query`, {
    method: 'GET',
    query: param,
  });
}

// 明细数据查询
export async function queryInspectDetailData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/iqc/detail/query`, {
    method: 'GET',
    query: param,
  });
}

// 明细数据查询
export async function queryInspectShowData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/create/page/line/query`, {
    method: 'GET',
    query: param,
  });
}

// 明细数据查询
export async function deleteInspectLineData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/create/page/delete`, {
    method: 'DELETE',
    body: params,
  });
}

// 明细数据查询
export async function saveInspectLineData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/create/page/save`, {
    method: 'POST',
    body: params,
  });
}

// 明细数据查询
export async function queryInspectLineTwoData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/create/page/lov/bring/data/query`, {
    method: 'GET',
    query: param,
  });
}

// 检验方案类型数据回填
export async function queryInspectLineByLovForData(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/sample/lov/bring/data/query`, {
    method: 'GET',
    query: param,
  });
}

// 主界面保存
export async function saveInspectAllData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/iqc/save`, {
    method: 'POST',
    body: params,
  });
}

// 主界面保存
export async function submitInspectAllData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/iqc/submit`, {
    method: 'POST',
    body: params,
  });
}

// 条码不良数查询
export async function queryBadNumberBarcode(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/nc/data/query/${params.inspectionId}`, {
    method: 'GET',
    query: param,
  });
}

// 条码不良数保存
export async function saveBadNumberBarcode(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/nc/data/update`, {
    method: 'POST',
    body: params,
  });
}

// 条码不良数删除
export async function deleteBadNumberBarcode(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/nc/data/delete`, {
    method: 'POST',
    body: params,
  });
}

// 查询物料批
export async function fetchMaterialLotCode(params) {
  // 转为JSON数据
  const param = parseParametersMes(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/materialLot`, {
    method: 'GET',
    query: param,
  });
}

// 修改物料批
export async function updateMaterialLotCode(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-iqc-check-platform/materialLot?iqcHeaderId=${params.iqcHeaderId}`, {
    method: 'POST',
    body: params.arr,
  });
}

// 查询物料批及供应商批次
export async function fetchMaterialLotCodeSL(params) {
  return request(`${Host}/v1/${organizationId}/wms-po-delivery/instruction/material/query`, {
    method: 'GET',
    query: params,
  });
}
