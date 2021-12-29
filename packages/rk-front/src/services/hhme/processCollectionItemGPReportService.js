/*
 * @Description: 工序采集项报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-13 16:52:15
 * @LastEditTime: 2020-08-03 18:34:52
 */
import request from '@/utils/request';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-27947';

// 查询报表数据GET /v1/{organizationId}/hme-process-collect
export async function fetchDataList(params) {
  const { page, size } = params;
  return request(`/mes-report/v1/${tenantId}/hme-process-collect/gp/list`, {
    method: 'POST',
    body: params,
    query: { page, size },
  });
}

