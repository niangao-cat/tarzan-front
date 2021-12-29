/*
 * @Description: IQC检验审核
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-19 17:14:45
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-13 15:29:57
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-19891';

// 获取iqc检验审核数据
export async function fetchAuditist(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/iqc-audit/list/head`, {
    method: 'GET',
    query,
  });
}

// 获取检验单行数据
export async function fetchiqcLine(params) {
  return request(`${Host}/v1/${organizationId}/iqc-audit/list/line/${params.iqcHeaderId}`, {
    method: 'GET',
    query: params,
  });
}

// 查询质检单明细数据
export async function handleSearchRowDetail(params) {
  return request(`${Host}/v1/${organizationId}/iqc-audit/list/details/${params.iqcLineId}`, {
    method: 'GET',
    query: params,
  });
}

// 让步、挑选、退货
export async function auditis(params) {
  return request(`${Host}/v1/${organizationId}/iqc-audit/audit`, {
    method: 'POST',
    body: params,
  });
}

// 删除免检数据
export async function deleteFreeData(params) {
  return request(`${Host}/v1/${organizationId}/qms-material-insp-exempts/remove/ui`, {
    method: 'POST',
    body: params.selectedRows,
  });
}
