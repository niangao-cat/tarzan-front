import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

// 查询事业部
export async function fetchDepartment(params) {
  return request(`${Host}/v1/${tenantId}/mt-work-order-management/wo-department`, {
    method: 'GET',
    query: params,
  });
}

// 查询
export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-repair-judge/list`, {
    method: 'GET',
    query: newParams,
  });
}

// 回车保存
export async function handleSavePermitCount(params) {
  return request(`${Host}/v1/${tenantId}/hme-repair-judge/save-permit-count`, {
    method: 'POST',
    body: params,
  });
}
// 停止返修
export async function handleStopRepair(params){
  return request(`${Host}/v1/${tenantId}/hme-repair-judge/stopRepair`, {
    method: 'POST',
    body: params,
  });
}
// 继续返修
export async function handleContinueRepair(params){
  return request(`${Host}/v1/${tenantId}/hme-repair-judge/continueRepair`, {
    method: 'POST',
    body: params,
  });
}



