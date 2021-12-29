/*
 * @Description: 已收待验看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-06 12:15:18
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-07 10:57:01
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId() || 0;
// const Host = '/mes-19891';

// 任务区域数据查询
export async function fetchCardData(params) {
  return request(`${ReportHost}/v1/${organizationId}/received-inspecting-board/get-card-data`, {
    method: 'GET',
    query: params,
  });
}

// 30天收货物料量
export async function fetchGetMaterial(params) {
  return request(`${ReportHost}/v1/${organizationId}/received-inspecting-board/get-received-quantity`, {
    method: 'GET',
    query: params,
  });
}

// 趋势图数据查询
export async function fetchTrend(params) {
  return request(`${ReportHost}/v1/${organizationId}/received-inspecting-board/get-year-rq-and-it`, {
    method: 'GET',
    query: params,
  });
}
