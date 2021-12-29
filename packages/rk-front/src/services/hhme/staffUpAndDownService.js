/*
 * @Description: 员工上下岗
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Autor: ywj
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 获取员工上下岗员工信息
export async function queryStaffData(params) {
  return request(`${Host}/v1/${tenantId}/hme-sign-in-out-records/user-info`, {
    method: 'GET',
    query: params,
  });
}


// 获取员工上下岗员工信息
export async function queryLineData(params) {
  return request(`${Host}/v1/${tenantId}/hme-open-end-shift/line`, {
    method: 'GET',
    query: params,
  });
}

// 员工上下岗获取考勤信息
export async function queryUpAndDownData(params) {
  return request(`${Host}/v1/${tenantId}/hme-sign-in-out-records/user-attendance`, {
    method: 'GET',
    query: params,
  });
}

// 上下岗班次信息
export async function queryFrequencyData(params) {
  return request(`${Host}/v1/${tenantId}/hme-sign-in-out-records/user-frequency`, {
    method: 'GET',
    query: params,
  });
}

// 员工上下岗按钮操作
export async function queryList(params) {
  return request(`${Host}/v1/${tenantId}/hme-sign-in-out-records/record-list`, {
    method: 'GET',
    query: params,
  });
}

// 员工上下岗记录列表查询
export async function setDateForStaff(params) {
  return request(`${Host}/v1/${tenantId}/hme-sign-in-out-records/record-creat`, {
    method: 'POST',
    body: params,
  });
}
