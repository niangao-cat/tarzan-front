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
// const prefix = '/mes-29730';

// cos目检条码表表查询
export async function fetchCosCheckBarcodes(params) {
  return request(`${ReportHost}/v1/${organizationId}/hme-cos-checkBarcodes`, {
    method: 'GET',
    query: params,
  });
}


