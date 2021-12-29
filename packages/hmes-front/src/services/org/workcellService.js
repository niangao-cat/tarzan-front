/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 * @LastEditTime: 2020-07-28 14:37:27
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-27947';
const tenantId = getCurrentOrganizationId();

/**
 * 查询工作单元表格数据
 * @async
 * @function fetchWorkcellList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchWorkcellList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-workcell/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询工作单元详细数据
 * @async
 * @function fetchWorkcellLineList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchWorkcellLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-workcell/record/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 工作单元保存
 * @async
 * @function saveWorkcell
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveWorkcell(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-workcell/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}
