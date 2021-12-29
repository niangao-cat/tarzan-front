/*
 * @Description: 已收待上架看板
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-28 09:45:36
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-28 17:52:59
 * @Copyright: Copyright (c) 2019 Hand
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId() || 0;
// const Host = '/mes-24503';

// 任务区域数据查询
export async function fetchBoarCard(params) {
  return request(`${ReportHost}/v1/${organizationId}/wms-checked-wait-grouding/task/data/query`, {
    method: 'GET',
    query: params,
  });
}

// 30天物料上架图
export async function fetchMaterial(params) {
  return request(`${ReportHost}/v1/${organizationId}/wms-checked-wait-grouding/material/storaged/num`, {
    method: 'GET',
    query: params,
  });
}

// 趋势图数据查询
export async function fetchTrend(params) {
  return request(`${ReportHost}/v1/${organizationId}/wms-checked-wait-grouding/trend/data/query`, {
    method: 'GET',
    query: params,
  });
}
