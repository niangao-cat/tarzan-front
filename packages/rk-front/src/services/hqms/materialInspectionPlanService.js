/*
 * @Description: 物料检验计划
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-26 11:29:23
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2021-02-08 17:33:38
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-19891';

/**
 * 默认站点信息
 *
 * @export
 * @returns
 */
export function fetchDefaultSite () {
  return request(`/mes/v1/${organizationId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

// 物料检验计划头查询
export async function fetchHeadList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/list/head/ui`, {
    method: 'GET',
    query,
  });
}

// 物料检验计划行查询
export async function fetchLineList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/list/line`, {
    method: 'GET',
    query,
  });
}

// 物料检验计划头创建
export async function handleSaveMaterPlan(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/save`, {
    method: 'POST',
    body: params,
  });
}

// 物料检验计划头发布
export async function pushMaterPlan(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/publish`, {
    method: 'POST',
    body: params.inspectionSchemeIds,
  });
}

// 检验组查询
export async function fetchInspectionGroup(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/list/quatity/ui`, {
    method: 'GET',
    query,
  });
}

// 检验组保存
export async function handleSaveInspectionTeam(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/add/tag-group`, {
    method: 'POST',
    body: params,
  });
}

// 检验组保存-行数据
export async function handleSaveInspectionTeamLine(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/edit/tag`, {
    method: 'POST',
    body: params,
  });
}

// 删除质检组
export async function deleteTagGroup(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/delete/tag-group`, {
    method: 'POST',
    body: params.tagGroupId,
  });
}

// 增量同步
export async function partSynchronize(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/part-synchronize`, {
    method: 'POST',
    body: params.param,
  });
}

// 全量同步
export async function allSynchronize(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/all-synchronize`, {
    method: 'POST',
    body: params.param,
  });
}

// 删除物料计划头数据
export async function deleteHead(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/delete`, {
    method: 'POST',
    body: params.selectedHead,
  });
}

// 组织查询
export async function fetchSite(params) {
  return request(`${Host}/v1/${organizationId}/mt-mod-site/query/ui`, {
    method: 'GET',
    query: params,
  });
}

// 复制
export function copy(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-inspection-schemes/copy`, {
    method: 'POST',
    body: params,
  });
}
