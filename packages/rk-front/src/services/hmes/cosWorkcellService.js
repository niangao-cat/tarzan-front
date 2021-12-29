/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2020-01-05 10:25:46
 * @LastEditTime: 2020-01-05 20:32:44
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24503';

// cos工位加工汇总表查询 GET /v1/{organizationId}/cos-workcell-summary
export async function fetchCosWorkcell(params) {
  return request(`${ReportHost}/v1/${organizationId}/cos-workcell-summary`, {
    method: 'GET',
    query: params,
  });
}


