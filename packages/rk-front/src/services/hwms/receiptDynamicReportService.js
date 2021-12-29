/*
 * @Description: 出入库动态报表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-02-02 17:42:49
 * @LastEditTime: 2021-02-03 10:04:16
 */

import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const prefix = '/mes-29730';

// 获取默认工厂
export async function getSiteList(params) {
    return request(`${Host}/v1/${tenantId}/wms-stock-transfer/list/site/get`, {
        method: 'GET',
        query: params,
    });
}

export async function handleFetchList(params) {
    const newParams = parseParameters(params);
    return request(`${Host}/v1/${tenantId}/wms-stock-dynamic-report/list`, {
        method: 'GET',
        query: newParams,
    });
}

// 站点查询
export async function fetchSiteList(params) {
    return request(`/mes/v1/${tenantId}/site`, {
        method: 'GET',
        query: params,
    });
}
