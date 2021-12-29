/*
 * @Description: 产品生产履历查询
 * @Version: 0.0.1
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 * @LastEditTime: 2020-08-12 19:08:02
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-19563';
const tenantId = getCurrentOrganizationId();

/**
 * 工位编码查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchWorkcellList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/eo-workcell`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchWorkcellDetail(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/eo-workcell-detail`, {
    method: 'GET',
    query: params,
  });
}

// 产品组件列表查询
export async function fetchProductComponent(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/product-component`, {
    method: 'GET',
    query: params,
  });
}

// 设备查询
export async function fetchEquipment(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/equipment`, {
    method: 'GET',
    query: params,
  });
}

// 异常信息
export async function fetchException(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/exception`, {
    method: 'GET',
    query: params,
  });
}

// 获取不良信息
export async function fetchNcList(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/nc`, {
    method: 'GET',
    query: params,
  });
}

// 追溯反响查询
export async function fetchReverse(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/reverse/trace`, {
    method: 'GET',
    query: params,
  });
}

// 追溯反响查询
export async function printSnReportCheck(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back//report-print-check/${params.eoNum}`, {
    method: 'GET',
  });
}

// 打印SN报告
export async function printSnReport(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/report-print/${params.eoNum}`, {
    method: 'POST',
    responseType: 'blob',
  });
}

/**
 * 明细界面查询
 * @async
 * @function fetchWorkCellInfo
 */
export async function fetchDetail(params) {
  return request(`${Host}/v1/${tenantId}/hme-eo-trace-back/quantity-analyze-query`, {
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