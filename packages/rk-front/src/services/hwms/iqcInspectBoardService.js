/*
 * @Description:描述
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-18 19:12:08
 * @LastEditTime: 2020-11-18 22:06:43
 */

import request from '@/utils/request';
import { ReportHost } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24503';

// 查询列表信息
export async function fetchList(params) {
  const param = parseParameters(params);
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-report/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 查询饼状图信息
export async function fetchPie(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-report/pie/ui`, {
    method: 'GET',
    query: params,
  });
}

// 查询折线图信息
export async function fetchLine(params) {
  return request(`${ReportHost}/v1/${organizationId}/qms-iqc-examine-report/line/ui`, {
    method: 'GET',
    query: params,
  });
}


