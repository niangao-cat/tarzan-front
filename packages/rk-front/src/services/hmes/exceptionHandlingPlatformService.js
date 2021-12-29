/*
 * @Description: 异常管理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-22 14:51:49
 */
import request from '@/utils/request';
import { Host, HZERO_PLATFORM } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-2794';
const organizationId = getCurrentOrganizationId();

// 获取默认站点
export async function getSiteList(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 输入工位
export async function enterOkSite(params) {
  return request(`/mes/v1/${organizationId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 工位输入
export async function enterSite(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/list/exception/ui`, {
    method: 'GET',
    query: params,
  });
}

// 获取工位数据
export async function getWocellList(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/query-area-workshop-prodLine-by-userId`, {
    method: 'POST',
    query: params,
  });
}

// 未输入工位
export async function enterNoSite(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/list/exception/not/login/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * @description: 异常提交
 * @param {type} params 异常数据
 * @return: list
 */
export async function commitException(params) {
  return request(`${Host}/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'POST',
    body: params,
  });
}

// 扫描设备
export async function enterEquipment(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/equipment/verification/ui`, {
    method: 'GET',
    query: params,
  });
}

// 扫描物料
export async function enterMaterial(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/material/lot/verification/ui`, {
    method: 'GET',
    query: params,
  });
}

// 创建异常消息记录
export async function createExceptionRecord(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/create/exception/record`, {
    method: 'POST',
    body: params,
  });
}

// 查看历史
export async function showExceptionRecordModal(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/query/exception/history/ui`, {
      method: 'GET',
      query: params,
    }
  );
}

// 查看历史
export async function showExceptionNoRecordModal(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/list/exception/history/not/login/ui`, {
      method: 'GET',
      query: params,
    }
  );
}

// 异常关闭
export async function closeException(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-handle-platform/close-exception-record`, {
    method: 'POST',
    body: params,
  });
}

// 查看员工具体信息
export async function fetchLineList(params) {
  return request(`${Host}/v1/${organizationId}/hme-exception-router/list/ui`, {
    method: 'GET',
    query: params,
  });
}

// 查看岗位下的员工具体信息
export async function fetchPositionData(params) {
  return request(`${HZERO_PLATFORM}/v1/${organizationId}/positions/user/${params.positionId}`, {
    method: 'GET',
  });
}

// 调用异步接口
export async function asyncSetData(params) {
  return request(
    `${Host}/v1/${organizationId}/itf-exception-wkc-record/send/ebs/exception/info`,
    {
      method: 'POST',
      body: params,
    }
  );
}

// 查看岗位下的员工具体信息
export async function fetchUserData(params) {
  return request(`${HZERO_PLATFORM}/v1/${organizationId}/employee-users/employee`, {
    method: 'GET',
    query: params,
  });
}


