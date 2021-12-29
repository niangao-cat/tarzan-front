// OQC检验平台 SERVICE层
// 引入必要的依赖包
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';
import { Host } from '@/utils/config';

// 获取组织Id
const organizationId = getCurrentOrganizationId();
const prefix = `${Host}/v1`;

// 数据查询
export async function fetchList(params) {
  // 转为JSON数据
  const param = parseParameters(params);
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-oqc-inspection-platform/scan-barcode`, {
    method: 'GET',
    query: param,
  });
}

// 创建
export async function createData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-oqc-inspection-platform/doc-create`, {
    method: 'POST',
    query: params,
  });
}

// 保存
export async function saveData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-oqc-inspection-platform/doc-save`, {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function submitData(params) {
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/qms-oqc-inspection-platform/doc-submit`, {
    method: 'POST',
    body: params,
  });
}
