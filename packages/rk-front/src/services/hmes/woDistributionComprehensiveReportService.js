/*
 * @Description: 工单配送综合查询报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-12-24 16:27:30
 * @LastEditTime: 2020-12-25 09:58:29
 */

import request from '@/utils/request';
// import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-19563';
const organizationId = getCurrentOrganizationId();

// 主查询
export async function handleSearch(params) {
  return request(`/mes-report/v1/${organizationId}/distribution-general`, {
    method: 'GET',
    query: params,
  });
}

// 导出
export async function exportExcel(params) {
  return request(`/mes-report/v1/${organizationId}/distribution-general/export`, {
    method: 'GET',
    query: params,
    responseType: 'blob',
  });
}
