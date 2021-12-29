/**
 * @Description: 生产领退料平台
 * @author: lly
 * @date 2021/07/05 10:53
 * @version 1.0
*/
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// const Host = '/mes-32410';

// 查询库存头信息
export async function fetchHeaderList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/instruction-docs/query/list`, {
    method: 'GET',
    query: param,
  });
}

// 查询行信息
export async function fetchLineList(params) {
  const param = parseParameters(params);
  delete param.instructionDocIds;
  return request(`${Host}/v1/${tenantId}/instruction-docs/query/line/${params.instructionDocIds}`, {
    method: 'GET',
    query: param,
  });
}

// 查询明细信息
export async function fetchDetailList(params) {
  // console.log('params==', params);
  const param = parseParameters(params);
  delete param.instructionId;
  return request(`${Host}/v1/${tenantId}/instruction-docs/query/attr/${params.instructionId}`, {
    method: 'GET',
    query: param,
  });
}

// 工厂下拉框
export async function querySiteList() {
  return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
    method: 'GET',
    query: {},
  });
}

// 获取默认工厂
export async function getSiteList(params) {
  return request(`${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}
